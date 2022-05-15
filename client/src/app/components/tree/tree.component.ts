import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

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
  menus: ITree[] = [];
  asub!: Subscription;

  mode = false;
  dark = false;
  title!: string | HTMLTitleElement | SVGTitleElement;
  /****
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
   ****/

  constructor(private http: HttpClient) {}
  ngOnDestroy(): void {
    if (this.asub) {
      this.asub.unsubscribe();
    }
  }

  ngOnInit(): void {
    const shema = 'sevstal_ch';
    this.asub = this.http
      .get<IDataForTree[]>(`/api/tree/${shema}`)
      .subscribe((data) => {
        const tmp = <IDataForTree[]>data;
        const out: ITree[] = [];
        tmp.sort((a, b) => a.LEV - b.LEV);

        tmp.forEach((item) => {
          const parent = item.PARENT_ID;
          const t = out.find((i) => i.docId === parent);
          if (t) {
            const obj = {
              docId: item.DOC_ID,
              level: item.LEV,
              title: item.DOC_NAME,
              icon: 'team',
              open: false,
              selected: false,
              disabled: false,
            };
            if (t.children) {
              t.children.push(obj);
            } else {
              t.children = [obj];
            }
          } else {
            const obj = {
              docId: item.DOC_ID,
              level: item.LEV,
              title: item.DOC_NAME,
              icon: 'team',
              open: false,
              selected: false,
              disabled: false,
            };
            out.push(obj);
          }
        });

        this.menus = out;
        console.log('out:', out);
      });
  }

  onMenuClick(event: any) {
    console.log(event);
  }
}
