import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { ArticlesService } from './articles.service'
import { NewArticleService } from '../article/new-article.service';
import { resource, url } from '../profileActions'
import {MatInputModule} from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select'

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.css']
})
export class ArticleComponent implements OnInit {
  sitearticles;
  loggedUser;
  userAvatars;
  //Limit number of articles on page
  viewlim = 10

  constructor(private articles: ArticlesService, private newarticle: NewArticleService) { }

  // Used so that articles and comments can only be edited by their authors
  getLoggedInUser(): void {
    resource('GET','following')
    .then(res => {
      this.loggedUser = res.username
    })
  }

  getUserAvatars(): void {
    resource('GET','avatars')
    .then(res => {
      this.userAvatars = res.avatars.reduce(function(obj, item) {
        obj[item.username] = item.avatar
        return obj
      }, {})
    })
  }

  // Handle article search
  searchArticles(searchterm): void {
    resource('GET',`articles/${searchterm}/${this.viewlim}`)
      .then(res => {
        this.sitearticles = res.articles.map(function(article) {
          article.date = new Date(article.date).toLocaleString()
          return article
        })
      })
  }

  resetSearch(searchbar): void {
    searchbar.value = ""
    this.loadDefault()
  }

  // Load default articles. Whenever an article is loaded, the stored UNIX timestamp is convered to readable time.
  loadDefault(): void {
    resource('GET',`articles/${this.viewlim}`)
      .then(res => {
        this.sitearticles = res.articles.map(function(article) {
          article.date = new Date(article.date).toLocaleString()
          return article
        })
      })
  }

  addArticle(textbox, imageinput): void {
    // IMPLEMENT IMAGE THING
    let fd = new FormData()
    let files = imageinput.files
    if (files.length > 0) {
      fd.append('image', files[0])
      imageinput.value = ""
    }
    fd.append('text', textbox.value)
    fetch(`${url}/article`,{
      method:'POST',
      credentials:'include',
      body:fd
    })
      .then(res => res.json())
      .then(res => {
          res['date'] = new Date(res.date).toLocaleString()
          this.sitearticles.unshift(res)
          textbox.value = ""
        })
  }

  cancelArticle(textbox): void {
    textbox.value = ""
  }

  editArticle(textbox, a_id): void {
    if (textbox.value) {
      resource('PUT',`articles/${a_id}`,{text:textbox.value})
        .then(res => {
          let article = this.sitearticles.filter(function(article) {
            return article.id === a_id
          })
          res['date'] = new Date(res.date).toLocaleString()
          this.sitearticles[this.sitearticles.indexOf(article[0])] = res
          textbox.value = ""
        })
    }
  }

  editComment(textbox, a_id, c_id): void {
    if (textbox.value) {
      resource ('PUT',`articles/${a_id}`,{text:textbox.value, commentId:c_id})
        .then(res => {
          let article = this.sitearticles.filter(function(article) {
            return article.id === a_id
            })
          let a_idx = this.sitearticles.indexOf(article[0])
          res['date'] = new Date(res.date).toLocaleString()
          this.sitearticles[a_idx] = res
          textbox.value = ""
        })
    }
  }
  ngOnInit() {
    this.loadDefault()
    this.getLoggedInUser()
    this.getUserAvatars()
  }
}
