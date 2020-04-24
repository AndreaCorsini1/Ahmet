import React from "react";
import {Bar} from 'react-chartjs-2';

class ContinuousHistogram extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            numb_param: props.numb_param,
            dati_iper_try: props.dati_iper_try,
            bins: 10
        };

        this.handleEx = this.handleEx.bind(this);
    }

    handleEx() {

        let numb = this.state.numb_param;
        let dat = this.state.dati_iper_try;
        let bin = this.state.bins;
        let start_inter, end_inter;

        //contenitori per grafici e coloridataset
        var num_gra = [];
        var color=[];

        //variabili di appoggio per bins
        let result = [];
        var dataset=[];
        var container = [];
        var i, j;

        //numero statico alto di colori
        for(i=0; i!==(bin+1); i++){
            color[i] = this.generateColor();
        }

         //numero grafici per usare map = formato array per usare map
        for(i=0; i!== numb; i++){
            num_gra[i] = i;
        }

        for (i=0; i !== numb; i++) {
            start_inter = dat[i].inter[0];
            end_inter = dat[i].inter[1];
            var myCopiedArray = {nome_hyp: '', intervalli:[]};

            myCopiedArray.nome_hyp = dat[i].iper_nome;
            myCopiedArray.intervalli = this.createInterval(bin,start_inter, end_inter);
            container.push(myCopiedArray);
        }

        for(j=0; j!==numb; j++) {
            start_inter = dat[j].inter[0];
            end_inter = dat[j].inter[1];
            result = this.calculateIntervalBins(bin, dat[j], start_inter, end_inter, dat[j].attempt.length);
            dataset[j] = this.generatorDataset(container[j].intervalli, result, color);
         }

        return(
            num_gra.map(e => (
                <div className="content mt-5">
                    <h3>Number of attempts for {dat[e].iper_nome} </h3>
                    <Bar data={dataset[e]}/>
                </div>
            ))
        );
    }

    calculateIntervalBins(bin, dat, start, end, attempt){

        let dimensione_bin = ((end - start)/bin);
        let i;
        let bins_calculated = new Array(bin+1).fill(0);
        //parte intera della divisione
        var answer, result, rest_div;

        for(i=0; i!== attempt; i++){
            result = dat.attempt[i] - start;
            rest_div = result/dimensione_bin;
            answer = Math.floor(rest_div);
            bins_calculated[answer] = bins_calculated[answer] + 1;
        }
        return bins_calculated;
    }
    /*
    divideInterval(container){
        let i,j;
        var destr =[];
        var chunk = 2;
        for (i=0,j=container.length; i<j; i+=chunk) {
            var temparray = [];
            temparray = container.slice(i,i+chunk);
            destr.push(temparray);
        }
        return destr;
    }*/
    createInterval(bin, start, end){

        //dimensione di ogni bin
        let dimensione_bin = ((end - start)/bin);
        let i;
        let bins_inter = [];
        bins_inter[0] = start;
        bins_inter[bin] = end;

        for(i=1; i<(bin); i++){
            bins_inter[i] = bins_inter[i-1] + dimensione_bin;
        }
        return bins_inter;
    }

    //random color for graph
    generateColor () {
        return '#' +  Math.random().toString(16).substr(-6);
    }

    generatorDataset(value, attempt, color){
        return {
            datasets: [{
                label: 'Number of occurrency',
                data: attempt,
                backgroundColor: color
            }],
            labels: value
        };
    }

    render() {
        console.log(this.props.label);
        return (
            <div className="content mt-2">
                <h3>
                    Hyperparameters of {this.props.label}
                </h3>
                <div>
                    {this.handleEx()}
                </div>
            </div>
        );
    }
}

export default ContinuousHistogram;
