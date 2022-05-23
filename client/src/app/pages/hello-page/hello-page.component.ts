import { Component } from '@angular/core';

@Component({
  selector: '',
  templateUrl: '',
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
