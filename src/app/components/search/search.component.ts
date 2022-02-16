import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // first inject the router into the component
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  // add the search method called from search.component.html
  // value = the keyword the user entered to search
  doSearch(value: string) {
    console.log(`value=${value}`);

    this.router.navigateByUrl(`/search/${value}`);
  }

}
