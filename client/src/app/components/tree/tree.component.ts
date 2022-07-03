import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TreeService } from '../../shared/services/tree.service';
import { ITreeNode } from '../../shared/interfaces';
import { Router } from '@angular/router';

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

  constructor(private treeService: TreeService, private router: Router) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.treeService.getLeftTree().subscribe(async (data) => {
      this.tree = data.sort((a, b) => a.ordering - b.ordering);
      await this.router.navigate([`/home/${this.tree[0].docId}`]);
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
