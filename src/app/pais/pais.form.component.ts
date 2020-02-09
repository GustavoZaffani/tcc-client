import {Component, Injector, ViewChild} from '@angular/core';
import {Pais} from './pais';
import {PaisService} from './pais.service';
import {NgForm} from '@angular/forms';
import {CrudFormComponent} from '../util/component/crud.form.component';

@Component({
  selector: 'app-form-pais',
  templateUrl: './pais.form.component.html',
  styleUrls: ['./pais.form.component.css']
})
export class PaisFormComponent extends CrudFormComponent<Pais, number> {

  @ViewChild('form', {static: true}) form: NgForm;

  constructor(protected paisService: PaisService,
              protected injector: Injector) {
    super(paisService, injector, '/pais');
  }
}
