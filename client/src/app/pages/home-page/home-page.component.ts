import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TreeService } from '../../shared/services/tree.service';
import { ITabData, ITreeDocs } from '../../shared/interfaces';
import { TabDataService } from '../../shared/services/tab-data.service';
import { DataServerService } from '../../shared/services/data-server.service';
import { Common } from '../../shared/classes/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less'],
})
export class HomePageComponent implements OnInit {
  docs!: ITreeDocs[];
  owner!: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private treeService: TreeService,
    private router: Router,
    private tabService: TabDataService,
    private server: DataServerService
  ) {
    const common = new Common();
    this.owner = common.owner;
  }

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

    const tab: ITabData = {
      docId: docId,
      title: `Документ № ${docId}`,
      isLoading: true,
    };
    const uid = this.tabService.add(tab);

    this.server.getDesc(this.owner, docId).subscribe({
      next: (data) => {
        //console.log('data:', data);
        const newTab: ITabData = {
          uid,
          docId: tab.docId,
          title: data.description.docName,
          description: data.description,
          procName: data.procName,
          params: data.params,
          isForm: data.form === 'Y',
          reportType: data.description.docClass,
          isSuccess: true,
          isLoading: false,
        };
        //console.log('tabs:', newTab);
        this.tabService.update(newTab);
      },
      error: (err) => {
        console.log(err.error);
        const newTab: ITabData = {
          uid,
          docId: tab.docId,
          title: 'Ошибка запроса',
          isSuccess: false,
          isLoading: false,
          errorMessage: err.error.message,
        };
        //console.log('tabs:', newTab);
        this.tabService.update(newTab);
      },
    });
  }
}
