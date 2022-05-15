import { Component } from '@angular/core';

@Component({
  selector: 'nz-demo-menu-horizontal',
  template: `
    <ul nz-menu nzMode="inline">
      <ng-container *ngFor="let menu of menus">
        <ng-container
          *ngTemplateOutlet="recursiveListTmpl; context: { menu: menu }"
        ></ng-container>
        <ng-template #recursiveListTmpl let-menu="menu">
          <li *ngIf="menu.children && menu.children.length > 0" nz-submenu>
            {{ menu.title }}
            <ng-container
              *ngTemplateOutlet="
                recursiveListTmpl;
                context: { menu: menu.children }
              "
            ></ng-container>
          </li>
        </ng-template>
        <li *ngIf="!menu.children || menu.children.length == 0" nz-menu-item>
          {{ menu.title }}
        </li>
      </ng-container>
    </ul>
  `,
})
export class HelloPageComponent {
  menus = [
    { title: 'test', children: [] },
    {
      title: 'with children',
      children: [
        { title: 'child', children: [{ title: 'child 2', children: [] }] },
      ],
    },
  ];
}
