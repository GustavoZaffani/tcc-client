import {Component, Injector, ViewChild} from '@angular/core';
import {CrudFormComponent} from '../util/component/crud.form.component';
import {Compra} from './compra';
import {CompraService} from './compra.service';
import {Fornecedor} from '../fornecedor/fornecedor';
import {FornecedorService} from '../fornecedor/fornecedor.service';
import {NgForm} from '@angular/forms';
import {ItemService} from '../item/item.service';
import {Item} from '../item/item';
import {CompraItem} from './compraItem';
import {MatTable, MatTableDataSource} from '@angular/material/table';
import {UsuarioService} from '../usuario/usuario.service';

@Component({
  selector: 'app-form-compra',
  templateUrl: './compra.form.component.html',
  styleUrls: ['./compra.form.component.css']
})
export class CompraFormComponent extends CrudFormComponent<Compra, number> {

  displayedColumns = ['item', 'qtde', 'valor', 'actionsForm'];
  fornecedorList: Fornecedor[];
  itemList: Item[];
  compraItem: CompraItem;
  dataSource: MatTableDataSource<CompraItem>;

  @ViewChild('form', {static: true}) form: NgForm;
  @ViewChild('table') table: MatTable<any>;

  constructor(protected compraService: CompraService,
              protected injector: Injector,
              private fornecedorService: FornecedorService,
              private itemService: ItemService,
              private usuarioService: UsuarioService) {
    super(compraService, injector, '/compra');
    this.compraItem = new CompraItem();
    if (!this.editando) {
      this.setUsuarioResponsavel();
    }
  }

  setUsuarioResponsavel() {
    const userLogado = localStorage.getItem('username');
    this.usuarioService.findByUsername(userLogado)
      .subscribe(e => {
        this.object.usuario = e;
      });
  }

  findFornecedores($event) {
    this.fornecedorService.complete($event.query)
      .subscribe(e => {
        this.fornecedorList = e;
      });
  }

  findProdutos($event) {
    this.itemService.complete($event.query)
      .subscribe(e => {
        this.itemList = e;
      });
  }

  getTotalCompra() {
    const valid = this?.object?.compraItem;
    if (valid) {
      return this.object.compraItem.map(t => t.valor).reduce((acc, value) => acc + value, 0);
    }
  }

  getQtdeTotal() {
    const valid = this?.object?.compraItem;
    if (valid) {
      return this.object.compraItem.map(t => t.qtde).reduce((acc, value) => Number(acc) + Number(value), 0);
    }
  }

  setPrecoProduto() {
    if (this.compraItem != null) {
      this.compraItem.valor = this.compraItem.item.valor;
    }
  }

  insertItem() {
    if (!this.object.compraItem) {
      this.object.compraItem = new Array();
    }
    const upQtde = this.object.compraItem.some(value => value.item.id === this.compraItem.item.id);
    if (upQtde) {
      this.object.compraItem.forEach(compItem => {
        if (compItem.item.id === this.compraItem.item.id) {
          compItem.qtde = Number(compItem.qtde) + Number(this.compraItem.qtde);
        }
      });
    } else {
      this.object.compraItem.push(this.compraItem);
    }
    this.compraItem = new CompraItem();
    this.table.renderRows();
  }

  removeItem(id: number) {
    let index;
    this.object.compraItem.forEach(compItem => {
      if (compItem.item.id === id) {
        index = this.object.compraItem.indexOf(compItem);
      }
    });
    this.object.compraItem.splice(index, 1);
    this.table.renderRows();
  }


}
