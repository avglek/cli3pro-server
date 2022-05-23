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

  menus = [
    {
      level: 1,
      title: 'Mail Group',
      icon: 'mail',
      open: true,
      selected: false,
      disabled: false,
      children: [
        {
          level: 2,
          title: 'Group 1',
          icon: 'bars',
          open: false,
          selected: false,
          disabled: false,
          children: [
            {
              level: 3,
              title: 'Option 1',
              selected: false,
              disabled: false,
            },
            {
              level: 3,
              title: 'Option 2',
              selected: false,
              disabled: true,
            },
          ],
        },
        {
          level: 2,
          title: 'Group 2',
          icon: 'bars',
          selected: true,
          disabled: false,
        },
        {
          level: 2,
          title: 'Group 3',
          icon: 'bars',
          selected: false,
          disabled: false,
        },
      ],
    },
    {
      level: 1,
      title: 'Team Group',
      icon: 'team',
      open: false,
      selected: false,
      disabled: false,
      children: [
        {
          level: 2,
          title: 'User 1',
          icon: 'user',
          selected: false,
          disabled: false,
        },
        {
          level: 2,
          title: 'User 2',
          icon: 'user',
          selected: false,
          disabled: false,
        },
      ],
    },
  ];
  subMenuIcon = 'folder';
  menuOpen: boolean = false;

  constructor(private treeService: TreeService) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {
    this.treeService.getLeftTree().subscribe((data) => {
      this.tree = data;
    });
  }

  onMenuClick(event: any) {
    console.log(event);
  }

  onOpenChange($event: boolean) {
    console.log('open change:', $event);
    if ($event) {
      this.subMenuIcon = 'folder-open';
    } else {
      this.subMenuIcon = 'folder';
    }
  }
}
