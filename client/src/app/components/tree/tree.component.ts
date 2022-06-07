import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TreeService } from '../../shared/services/tree.service';
import { ITreeNode } from '../../shared/interfaces';

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

  constructor(private treeService: TreeService) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.treeService.getLeftTree().subscribe((data) => {
      this.tree = data.sort((a, b) => a.ordering - b.ordering);
    });
  }

  onOpenChange($event: boolean) {
    if ($event) {
      this.subMenuIcon = 'folder-open';
    } else {
      this.subMenuIcon = 'folder';
    }
  }
}
