import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';

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
  constructor(private http: HttpClient) {}
  ngOnDestroy(): void {}

  ngOnInit(): void {}
}
