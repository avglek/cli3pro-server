import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { TreeService } from '../../shared/services/tree.service';
import { ITreeNode } from '../../shared/interfaces';
import { Router } from '@angular/router';

interface IDataForTree {
  DOC_ID: number;
  DOC_NAME: string;
  title: string;
  IMG_INDEX: number;
  LEV: number;
  ORDERING: number;
  PARENT_ID: number;
  SEL_INDEX: number | null;
}

interface ITree {
  docId: number;
  level: number;
  title: string;
  icon: string;
  open: boolean;
  selected: boolean;
  disabled: boolean;
  children?: ITree[];
}

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
