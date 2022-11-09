import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { TreeService } from '../../shared/services/tree.service';
import { ITabData, ITreeDocs } from '../../shared/interfaces';
import { TabDataService } from '../../shared/services/tab-data.service';
import { DataServerService } from '../../shared/services/data-server.service';
import { CommonService } from '../../shared/services/common.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less'],
})
export class HomePageComponent implements OnInit {
  docs!: ITreeDocs[];
  isLoading: boolean = false;
  owner: string = '';

  constructor(
    private activateRoute: ActivatedRoute,
    private treeService: TreeService,
    private router: Router,
    private tabService: TabDataService,
    private server: DataServerService,
    private commonService: CommonService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.owner = this.commonService.getCurrentOwner() || '';

    this.isLoading = true;
    this.activateRoute.params
      .pipe(
        switchMap((params) => {
          return this.treeService.getDocs(this.owner, params['id']);
        })
      )

      .subscribe({
        next: (data) => {
          const roles = this.authService.getCurrentRoles();
          this.isLoading = false;
          this.docs = data
            .filter((doc) => roles?.includes(doc.roleName!))
            .map((doc) => ({
              ...doc,
              ordering: doc.ordering ? doc.ordering : 0,
            }))
            .sort((a, b) => a.ordering - b.ordering);
        },
        error: (err) => {
          this.isLoading = false;
          console.log('error:', err);
        },
      });
  }

  async onClick(docId: number) {
    await this.router.navigate(['/doc']);

    const tab: ITabData = {
      uid: '',
      docId: docId,
      title: `Документ № ${docId}`,
      isLoading: true,
    };
    const uid = this.tabService.add(tab);

    console.log(
      'post desc:',
      this.commonService.getCurrentOwner() || '',
      docId
    );

    this.server
      .getDesc(this.commonService.getCurrentOwner() || '', docId)
      .subscribe({
        next: (data) => {
          console.log('get description:', data);
          const isEdit = !!data.params.find(
            (param) => param.argumentName === 'P_UPDATE_TABLE'
          );
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
            owner: this.owner,
            isEdit,
          };
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
          this.tabService.update(newTab);
        },
      });
  }
}
