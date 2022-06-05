class CalcController {
    constructor() {
        //Audio
        this._audio = new Audio('click.mp3');
        this._audioOnOff=false;
        this._lastOperator='';
        this._lastNumber = '';
        this._operation =[];
        this._locale = 'pt-BR'; //local definido como Brasil
        this._displayCalcEl = document.querySelector("#display"); //display onde aparecerá os numeros
        this._dateEl = document.querySelector("#data"); //onde aparecerá a data no display
        this._timeEl = document.querySelector("#hora"); //onde aparecerá a hora no display
        this._currentDate;
        this.initialize();
        this.initButtonsEvents();
        this.initKeyBoard();
    }

    pasteFromClipboard(){
        document.addEventListener('paste', e=>{
            let text = e.clipboardData.getData('Text');
            this.displayCalc = parseFloat(text);
            console.log(text);

        });

    }

    copyToClipboard(){
        let input = document.createElement('input');
        input.value=this.displayCalc;
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        input.remove();
    }
    //como a calculadora será iniciada
    initialize() {
        this.setDisplayDateTime();
        //atualiza a hora  
        setInterval(() => {
            this.setDisplayDateTime();
        }, 1000);
        this.setLastNumberToDisplay();
        this.pasteFromClipboard();
        document.querySelectorAll('.btn-ac').forEach(btn  =>{
            btn.addEventListener('dblclick', e=>{
                this.toggleAudio();
            });

        });

    }
    toggleAudio(){
    this._audioOnOff = !this._audioOnOff;
    }

    playAudio(){
        if(this._audioOnOff){
            this._audio.currentTime=0;
            this._audio.play();
        }
    }
    initKeyBoard(){
        document.addEventListener('keyup', e =>{
            this.playAudio();
            console.log(e.key);
            switch(e.key){
            //-------AC
            case 'Escape':
            case 'Delete':
                this.clearAll();
            break;

            //-------CE
            case 'Backspace':
                this.clearEntry();
            break;

            //-------SOMA
            case '+':
            case '-':
            case '/':
            case '*':
            case '%':
                this.addOperation(e.key);
            break;
            //-------IGUAL
            case 'Enter':
            case '=':
               this.calc();
            break;

            //-------PONTO
            case '.':
            case ',':
                this.addDot();
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
               this.addOperation(parseInt(e.key));
            break;
            case 'c':
                    if(e.ctrlKey) this.copyToClipboard();

                    
                    break;
    }

        });
    }
    //Eventos de mouse e teclado
    addEventListenerAll(element, events, fn){
        events.split(' ').forEach(event => {
            element.addEventListener(event, fn, false);
        });
        
    }
    //limpa tudo que foi digitado
    clearAll(){
        this._operation= [];
        this._lastNumber='';
        this._lastOperator='';
        this.setLastNumberToDisplay(); 
    }
    //limpa o ultimo numero digitado
    clearEntry(){
        this._operation.pop();
        this.setLastNumberToDisplay(); 
    }
    //retorna o valor da tecla digitada
    getLastOperation(){
       return  this._operation[this._operation.length-1];
    }
    //define o valor da tecla digitada
    setLastOperation(value){
        this._operation[this._operation.length-1] = value;
    }
    //operadores
    isOperator(value){
       return (['+','-', '*','%', '/', '*','.'].indexOf(value) > -1);
    }

    pushOperation(value){
        this._operation.push(value);
        if(this._operation.length>3){
        
        this.calc();
           console.log(this._operation); 
        }
    }
    getResult(){
        try{
        return eval(this._operation.join(""));
        }catch(e){
            setTimeout(()=>{

                this.setError();
            },1);
            
            console.log(e);
        }

    }
    calc(){
        let last='';
        this._lastOperator=this.getLastItem();
        if(this._operation.length<3){
            let firstItem = this._operation[0];
            this._operation = [firstItem, this._lastOperator, this._lastNumber];

        }
        
        if(this._operation.length>3){
            last = this._operation.pop();
            
            this._lastNumber = this.getResult();
        }
          else  if(this._operation.length==3){

            this._lastNumber = this.getLastItem(false);
            
        } 
        console.log('_lastOperator', this._lastOperator);
        console.log('_lastNumber', this._lastNumber);
        let result = this.getResult();
        if(last=='%'){
            result /=100;
            this._operation =[result];
        }

        else{
                 this._operation=[result];
                 if(last) this._operation.push(last);
                
        }
        

        this.setLastNumberToDisplay();
    }
    
    getLastItem(isOperator=true){

        let lastItem ;

        for(let i=this._operation.length-1; i>=0; i--){

            if(this.isOperator(this._operation[i])==isOperator){
                lastItem = this._operation[i];
                break;
            }
    
        } 
        if(!lastItem){
            lastItem =(isOperator)? this._lastOperator:this._lastNumber;

        }  
        return lastItem;
    }



    setLastNumberToDisplay(){
        let lastNumber = this.getLastItem(false);

        if(!lastNumber) lastNumber=0;
        this.displayCalc = lastNumber;
    
        
    }

    addOperation(value){
        if(isNaN(this.getLastOperation())){
           if(this.isOperator(value)){
            this.setLastOperation(value);
           }
           else{
               this.pushOperation(value);
               this.setLastNumberToDisplay(); 
               
           }
           
        }
        else{
            if(this.isOperator(value)){
                this.pushOperation(value);
            }
            else{
                let newValue =  this.getLastOperation().toString() + value.toString();
                this.setLastOperation(newValue);
                //atualizar o display
                this.setLastNumberToDisplay();   
            }
         
        }
        
        console.log(this._operation);
    }

    setError(){
        this.displayCalc="Error";
    }

    addDot(){

        let lastOperation = this.getLastOperation();
        if(typeof lastOperation==='string' && lastOperation.split('').indexOf('.')>-1) return;

        if(this.isOperator(lastOperation)|| !lastOperation){
            this.pushOperation('0.');
        }else{
            this.setLastOperation(lastOperation.toString()+ '.');
        }
        this.setLastNumberToDisplay();
    }
    //ações dos botões
    execBtn(value){
        this.playAudio();
        switch(value){
            //-------AC
            case 'ac':
                this.clearAll();
            break;

            //-------CE
            case 'ce':
                this.clearEntry();
            break;

            //-------SOMA
            case 'soma':
                this.addOperation("+");
            break;

            //-------SUBTRACAO
            case 'subtracao':
                this.addOperation("-");
            break;

            //-------DIVISAO
            case 'divisao':
                this.addOperation("/");
            break;

            //-------MULTIPLICACAO
            case 'multiplicacao':
                this.addOperation("*");
            break;

            //-------PORCENTO
            case 'porcento':
                this.addOperation("%");
            break;

            //-------IGUAL
            case 'igual':
               this.calc();
            break;

            //-------PONTO
            case 'ponto':
                this.addDot();
            break;

            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
               this.addOperation(parseInt(value));
            break;

            default:
                console.log("Tá dando erro");
                this.setError();
            break;

    }
}
    //evento de clique no botão
    initButtonsEvents(){ 
    //querySelectorAll seleciona todos os elementos dentro de #buttons e #parts
    let buttons = document.querySelectorAll("#buttons > g, #parts > g");
    
       buttons.forEach((btn, index)=>{
        //metodo de click
        this.addEventListenerAll(btn,"click drag", e=>{
            //className.baseVal mostra a classe do botão clicado e replace tira o btn- e aparece só o botão exemplo btn-9, fica só 9
            let textBtn = btn.className.baseVal.replace("btn-","");
            this.execBtn(textBtn);
        }); 
        //metodo de mouse
        this.addEventListenerAll(btn, "mouseover mouseup mousedown", e =>{
            btn.style.cursor="pointer";
        });

    });
}

    // coloca a data pela localidade do sistema
    setDisplayDateTime()
    {
        this.displayDate = this.currentDate.toLocaleDateString(this._locale, 
            {
            day: "2-digit", //dia com 2 digitos
            month: "long", //mês por extenso
            year: "numeric" //ano inteiro 4 digitos
        });
        this.displayTime = this.currentDate.toLocaleTimeString(this._locale);
    }
    //hora, pega o elemento html que ela está inserida
    get displayTime()
    {
        return this._timeEl.innerHTML;
    }
    set displayTime(value)
    {
        return this._timeEl.innerHTML = value;
    }
    get displayDate()
    {
        return this._dateEl.innerHTML;
    }

    set displayDate(value) 
    {
        return this._dateEl.innerHTML = value;
    }



    //display onde mostra os números e operações
    get displayCalc()
    {
        return this._displayCalcEl.innerHTML;
    }
    set displayCalc(value)
    {
        if(value.toString().length>10){
            this.setError();
            return false;
        }
        this._displayCalcEl.innerHTML = value;
    }

    //pega a data
    get currentDate() 
    {
        return new Date();
    }
    set currentDate(value)
    {
        this._currentDate = value;
    }
}