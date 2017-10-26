import { Component, OnInit, Input } from '@angular/core';
import { Http } from '@angular/http';
import { RuleService } from '../../../services/rule/rule.service';
import { Rule } from '../../../models/rule';
import { ProfileService } from '../../../services/profile/profile.service';
import { Profile } from '../../../models/profile';
import { Router } from '@angular/router';
import { PageService } from '../../../services/pagenate/page.service';
import { PagenateComponent } from '../../../components/pagenate/pagenate.component';
import { RuleProfile } from '../../../models/rule-profile';
import { AccessPageService } from '../../../services/page/page.service';
import { Page } from '../../../models/page';

@Component({
  selector: 'app-rule',
  inputs: ['pk', 'header'],
  templateUrl: './rule.component.html',
  styleUrls: ['./rule.component.css']
})
export class RuleComponent extends PagenateComponent implements OnInit {

  @Input() selectedPage: Page;
  @Input() pk: any;
  @Input() lg = false;

  options: any[] = ['Visualizar', 'Criar', 'Editar', 'Desabilitar']
  checked: any[] = new Array();

  rule: Rule = new Rule();

  profile: Profile = new Profile();
  hasdata: boolean;

  constructor(
    pagerService: PageService,
    private http: Http,
   // private ruleService: RuleService,
    private profileService: ProfileService,
    private ruleService: RuleService,
    private accessPageService: AccessPageService,
    private router: Router) {
      super(pagerService);
      this.hasdata = false;
    }

  ngOnInit() {
    console.log(this.selectedPage);
  }

  updateChecked(option, event) {
    console.log('event.target.value ' + event.target.value);
    const index = this.checked.indexOf(option);
    if(event.target.checked) {
      console.log('add');
      if ( index === -1) {
        this.checked.push(option);
      }
    } else {
      console.log('remove');
      if ( index !== -1) {
        this.checked.splice(index, 1);
      }
    }
    console.log(this.checked);
  }

  verifyRules() {
    for (let i = 0; i < this.checked.length; i++) {
      if (this.checked[i] === this.options[0]) {
        this.rule.view = true;
      }
      if (this.checked[i] === this.options[1]) {
        this.rule.insert = true;
      }
      if (this.checked[i] === this.options[2]) {
        this.rule.edit = true;
      }
      if (this.checked[i] === this.options[3]) {
        this.rule.disable = true;
      }
    }
    console.log('view', this.rule.view);
  }


  confirmRules() {
    this.verifyRules();
    this.profile = this.accessPageService.getProfile();

    this.rule.id_page = this.selectedPage.id;
    this.rule.id_profile = this.profile.id;

    this.ruleService.saveRule(this.rule).subscribe(
      success => {
        this.profile.rule = success;
        console.log('Regra salva:', success);
        console.log('Regra adicionada ao perfil:', this.profile.rule);
        this.profileService.saveEditProfile(this.profile).subscribe(
          success => {
            console.log('perfil editado:', success);
          },
          error => <any>error
        );
      },
      error => <any>error
    );
  }
}
