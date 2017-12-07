import { Injectable } from '@angular/core';
import { ArticlesService } from '../article/articles.service'

@Injectable()
export class FollowingService {
  constructor(private articles: ArticlesService) {}

}
