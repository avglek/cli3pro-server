import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TreeService } from '../../shared/services/tree.service';
import { ITabData, ITreeDocs } from '../../shared/interfaces';
import { customAlphabet } from 'nanoid';
import { TabDataService } from '../../shared/services/tab-data.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less'],
})
export class HomePageComponent implements OnInit {
  docs!: ITreeDocs[];

  constructor(
    private activateRoute: ActivatedRoute,
    private treeService: TreeService,
    private router: Router,
    private dataService: TabDataService
  ) {}

  ngOnInit(): void {
    this.activateRoute.params
      .pipe(
        switchMap((params) => {
          return this.treeService.getDocs(params['id']);
        })
      )

      .subscribe((data) => {
        this.docs = data;
      });
  }

  async onClick(docId: number) {
    await this.router.navigate(['/doc']);
    console.log(docId);
    const data: ITabData = {
      docId: docId,
      title: `Документ № ${docId}`,
    };
    this.dataService.add(data);
  }
}
