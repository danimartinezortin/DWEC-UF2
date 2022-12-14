class Objectives {

    _timeToInvert = 0;
    _maxDayTime = 0;
    _startDate = new Date();
    _daysMap = new Map();
    _name;
    
    constructor(name, time, max){
        if(name && time && max){
            this.Name = name;
            this.TimeToInvert = time;
            this.MaxDayTime = max;
        }
    }

    set Name(name){
        this._name = name;
    }
    get Name(){
        return this._name;
    }
    set TimeToInvert(time){
        if(time < 0){
            throw new RangeError();
        } else {
            this._timeToInvert = time;
        }
    }
    get TimeToInvert(){
        return this._timeToInvert;
    }
    set MaxDayTime(max){
        if(max < 0){
            throw new RangeError();
        } else {
            this._maxDayTime = max;
        }
    }
    get MaxDayTime(){
        return this._maxDayTime;
    }

    get StartDate(){
        return this._startDate;
    }

    get DaysMap(){
        return this._daysMap;
    }

    GenerateDays(){
        let totalToInvert = this.TimeToInvert;
        let dailyObjective = this.StartDate;
        while(totalToInvert > 0){
            this._daysMap.set(dailyObjective.toISOString(), this.MaxDayTime);
            totalToInvert = totalToInvert - this.MaxDayTime;
            dailyObjective.setDate(dailyObjective.getDate() + 1)
        }
    }

    SaveOnLocalStorage(){
        let jsonString =  JSON.stringify({"name": this.Name, "timeToInvert": this.TimeToInvert, "maxDayTime": this.MaxDayTime, "startDate": this.StartDate, "data": Array.from(this.DaysMap.entries())});
        localStorage.setItem(this.Name, jsonString);
    }

    RecoverFromLocalStorage(name){
        let jsonString = localStorage.getItem(name);
        const data = JSON.parse(jsonString)
        this.Name = data.name;
        this.TimeToInvert = data.timeToInvert;
        this.MaxDayTime = data.maxDayTime;
        this._startDate = data.startDate;
        this._daysMap = new Map(data.data);
    }
}

document.querySelector("form").addEventListener('submit', (event) => {
    const name = document.querySelector("#name").value;
    const total = document.querySelector("#total").value;
    const max = document.querySelector("#max").value;
    if(name && total && max){
        let objective = new Objectives(name, total, max);
        objective.GenerateDays();
        objective.SaveOnLocalStorage();
    }
    event.preventDefault();
    event.stopPropagation();
});

document.querySelector("#load").addEventListener("click", (event) => {
    const name = document.querySelector("#name").value;
    if(name){
        let objective = new Objectives();
        objective.RecoverFromLocalStorage(name);
        console.log(objective.DaysMap)
    }
});