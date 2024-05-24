import {Component, Element, Listen, Prop, State, h} from '@stencil/core'

export interface Column {
  key: string,
  displayName: string,
  filterList: string[]
}

@Component({
  tag: 'uc-table',
  styleUrl: './table.css',
  shadow: true
})
export class Table {
  tableElement: HTMLTableElement;
  openList: HTMLUcOpenListElement;

  @Prop() dataTable:any[] = [];
  @Prop() displayColumns: Column[] = [];
  @State() dataTableRender: any[] =[];
  @State() dataTableFilter: any[] =[];

  sortTable(columnIndex: number){ 
    console.log('vamos sortear')
    let rows:HTMLCollectionOf<HTMLTableRowElement>, 
    switching:boolean, 
    rowIndex:number,
    dataCurrentRow: Element, 
    dataNextRow: Element,
    shouldSwitch:boolean,
    direction: "asc" | "desc", 
    switchcount:number;


    switchcount = 0;
    switching= true;
    direction = "asc";

    while(switching){
      switching = false;

      rows = this.tableElement.rows;

      for(rowIndex = 1; rowIndex < rows.length - 1; rowIndex++){
        shouldSwitch = false;

        dataCurrentRow = rows[rowIndex].getElementsByTagName("TD")[columnIndex];
        dataNextRow = rows[rowIndex + 1].getElementsByTagName("TD")[columnIndex];

        if(direction == "asc"){
          if(dataCurrentRow.innerHTML.toLowerCase() > dataNextRow.innerHTML.toLowerCase()){
            shouldSwitch = true;
            break;
          }
        }else if(direction == "desc"){

          if(dataCurrentRow.innerHTML.toLowerCase() < dataNextRow.innerHTML.toLowerCase()){
            shouldSwitch = true;
            break;
          }
        }
      }

      if(shouldSwitch){
        rows[rowIndex].parentNode.insertBefore(rows[rowIndex+ 1], rows[rowIndex]);
        switching = true;

        switchcount ++;
      }else {
        if(switchcount == 0 && direction =="asc") {
          direction = "desc";
          switching = true;
        }
      }
    }
  }

  openFilter(columnIndex: number){
    const filterList = new Set([]) 
    let rows: HTMLCollectionOf<HTMLTableRowElement>,
    td: Element, 
    
    filterIcon: Element

    rows = this.tableElement.rows;
    // // Loop through all table rows, and hide those who don't match the search query
    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      td = rows[rowIndex].getElementsByTagName("td")[columnIndex]
      
      if (td) {
        filterList.add(td.textContent.trim())
      }
    }

    for(let i = 0; i < this.displayColumns.length; i++){
      filterIcon = rows[0].getElementsByTagName("th")[i].getElementsByClassName("head__data-container")[0]
      if(filterIcon.classList.contains("relative")){
        filterIcon.classList.remove("relative")
      }

    }

    filterIcon = rows[0].getElementsByTagName("th")[columnIndex].getElementsByClassName("head__data-container")[0]
    if(filterIcon){
      console.log("esse é o filtro", filterIcon)
      filterIcon.classList.add("relative")
      filterIcon.appendChild(this.tableElement.getElementsByTagName("uc-open-list")[0])
    }

    this.openList.optionsList = Array.from(filterList)
    if(this.openList.opened){
      this.openList.close()
    }
    this.openList.open()

    // (async () => {
    //   await customElements.whenDefined('uc-open-list');

    // })
    

    
      // console.log(td)
      // if (td) {
      //   console.log(this.displayColumns[columnIndex])
      //   filterList = this.displayColumns[columnIndex].filterList.map(filterOption => filterOption.trim().toLowerCase());
      //   txtValue = td.textContent.trim().toLowerCase();
      //   console.log(txtValue.toLowerCase())
      //   console.log(filterList)
      //   console.log(filterList.includes('testando 2'))
      //   console.log(filterList.includes(txtValue))
      //   if (filterList.includes(txtValue)) {
      //     console.log(rows[rowIndex])
      //     console.log(txtValue.toLowerCase())
      //     rows[rowIndex].style.display = "";
      //   } else {
      //     console.log(rows[rowIndex])
      //     rows[rowIndex].style.display = "none";
      //   }
      // }
    // }

    console.log(this.tableElement.rows)
    console.log(this.dataTable)
  }


  @Listen('emitFilterItens')
  filterTableByColumns(event: CustomEvent){
    console.log(event.detail)
    const filterList = Array.from(event.detail as string[]).map((filterOption) => filterOption.trim().toLowerCase()) 
    let rows: HTMLCollectionOf<HTMLTableRowElement> = this.tableElement.rows

    for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
      const cells = Array.from(rows[rowIndex].getElementsByTagName("td"));
      if(!cells.some((cell) => filterList.includes(cell.textContent.trim().toLowerCase()))){
        rows[rowIndex].style.display = "none";
      }else{
        rows[rowIndex].style.display = "";
      }
    }
  
  } 
 



  buildHead(): HTMLElement{
    return (
      <thead class="table__head">
        <tr>
          { this.displayColumns.map((column, index) => {
            return  <th key={`${column}-${index}`}>
                      <div class="head__data-container">
                        <icon onClick={this.sortTable.bind(this, index)} class="table__icon--order">^</icon>
                        <span>{column.displayName}</span>
                        <icon onClick={this.openFilter.bind(this, index)} class="table__icon--filter">f
                        </icon>
                      </div>
                      
                    </th>
            })
          }
        </tr>
      </thead>
     
    )
  }


  buildBody(){
    return (
      <tbody class="table__body">
        {
          this.dataTable.map((row, index) => {
            return  <tr key={`${row}-${index}`}>
                      {
                        this.displayColumns.map((column, columnIndex) => {
                          return  <td key={`${index}-${columnIndex}`}>
                                    {row[column.key]}
                                  </td>
                        })
                      }
                    </tr>
            })
        }
      </tbody>      
    )
  }


  render(){
    return (
      // <div class="table__cotainer">
        <table class="table" ref={el => this.tableElement = el}>
          {this.buildHead()}
          {this.buildBody()}
          <uc-open-list ref={el => this.openList = el}></uc-open-list>
        </table>
        
      // </div>
    )
  }
}