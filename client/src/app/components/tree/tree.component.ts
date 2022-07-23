import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TreeService } from '../../shared/services/tree.service';
import { ITreeNode } from '../../shared/interfaces';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

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

  tree!: ITreeNode[];

  subMenuIcon = 'folder';
  isLoading: boolean = false;

  constructor(private treeService: TreeService, private router: Router) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.treeService
      .getLeftTree()
      .pipe(
        tap(() => {
          this.isLoading = true;
        })
      )
      .subscribe({
        next: async (data) => {
          this.isLoading = false;
          this.tree = data.sort((a, b) => a.ordering - b.ordering);
          await this.router.navigate([`/home/${this.tree[0].docId}`]);
        },
        error: (err) => {
          this.isLoading = false;
          console.log('error tree:', err);
        },
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
