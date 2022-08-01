import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TreeService } from '../../shared/services/tree.service';
import { ITreeNode } from '../../shared/interfaces';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { CommonService } from '../../shared/services/common.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.less'],
})
export class TreeComponent implements OnInit, OnDestroy {
  @Input() isCollapsed!: boolean;

  mode = false;
  dark = false;
  title!: string | HTMLTitleElement | SVGTitleElement;

  tree: ITreeNode[] = [];

  subMenuIcon = 'folder';
  isLoading: boolean = false;

  constructor(
    private treeService: TreeService,
    private router: Router,
    private commonService: CommonService,
    private msg: NzNotificationService
  ) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.commonService.initCurrentOwner();

    this.commonService.owner
      .pipe(
        catchError((err, caught) => {
          this.isLoading = false;
          console.log('tree init error:', err);
          return caught;
        })
      )
      .subscribe((owner) => {
        this.isLoading = true;
        this.treeService.getLeftTree(owner).subscribe({
          next: async (data) => {
            this.isLoading = false;
            this.tree = data.sort((a, b) => a.ordering - b.ordering);
            await this.router.navigate([`/home/${this.tree[0].docId}`]);
          },
          error: (err) => {
            this.msg.error('Ошибка открытия схемы', err.error.message);
            console.log('get owner error:', err);
            this.isLoading = false;
            this.tree = [];
          },
        });
      });
  }

  async onOpenChange($event: boolean, docId: number) {
    if ($event) {
      this.subMenuIcon = 'folder-open';
    } else {
      this.subMenuIcon = 'folder';
    }
    await this.router.navigate([`/home/${docId}`]);
  }
}
