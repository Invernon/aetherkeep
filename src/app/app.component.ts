import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Aether Solution';
  public drawBackground: boolean;
  constructor(private router: Router){

    router.events.subscribe(event => {
      if(event instanceof NavigationStart) {
        this.modifyHeader(event)
      }
    });

  }

  modifyHeader(location) {
    console.log(location.url)
    if (location.url.split('/')[1] != "home" )
    {
        this.drawBackground = false;
    } else {
        this.drawBackground = true;
      }
   }
}
