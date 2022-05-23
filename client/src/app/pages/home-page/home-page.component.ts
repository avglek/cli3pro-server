import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TreeService } from '../../shared/services/tree.service';
import { ITreeDocs } from '../../shared/interfaces';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less'],
})
export class HomePageComponent implements OnInit {
  docs!: ITreeDocs[];
  constructor(
    private router: ActivatedRoute,
    private treeService: TreeService
  ) {}

  ngOnInit(): void {
    this.router.params
      .pipe(
        switchMap((params) => {
          return this.treeService.getDocs(params['id']);
        })
      )

      .subscribe((data) => {
        console.log(data);
        this.docs = data;
      });
  }
}
