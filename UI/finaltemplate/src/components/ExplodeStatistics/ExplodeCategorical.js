import React from "react";
import {Polar} from "react-chartjs-2";

//grafico di quante volte ogni iperparametro è stato provato

class ExplodeCategorical extends React.Component {

   constructor(props) {
        super(props);
        this.state = {
            label: props.label,
            numb_param: props.numb_param,
            dati_iper_try: props.dati_iper_try
        };

       this.handleEx = this.handleEx.bind(this);
    }

    handleEx() {
           let numb = this.state.numb_param;
           let dat = this.state.dati_iper_try;
           var num_gra = [];
           var color=[];
           var dataset=[];
           var i;

           //numero grafici per usare map = formato array per usare map
           for(i=0; i!== numb; i++){
               num_gra[i] = i;
           }

           //numero statico alto di colori
           for(i=0; i!==30; i++){
               color[i] = this.generateColor();
           }

           //dataset è un array che contiene array di tutti gli studi passati
           for(i=0; i!==numb; i++) {
               dataset[i] = this.generatorDataset(dat[i].value, dat[i].attempt, color);
           }

           //for per ogni grafico che chiama polar, num_gra indica il numero di grafici da fare
           //il numero lo prende dalla prop del padre e lo converte in un array per render

           return(
              num_gra.map(e => (
                  <div className="content mt-5">
                      <h3>Number of attempts for {dat[e].iper_nome} </h3>
                        <Polar data={dataset[e]}/>
                  </div>
              ))
       );
    }

    //random color for graph
     generateColor () {
            return '#' +  Math.random().toString(16).substr(-6);
     }

     generatorDataset(value, attempt, color){
         return {
               datasets: [{
                   data: attempt,
                   backgroundColor: color
               }],
               labels: value
           };
     }

    render() {
        return (
            <div className="content mt-2">
                <h3>
                    Number of attempts for each hyperparameter for {this.state.label}
                </h3>
                <div>
                    {this.handleEx()}
                </div>
            </div>
        );
    }
}

export default ExplodeCategorical;