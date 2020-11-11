interface SignData {
    /**
     * 已经签到过的天数id 集合
     */
    signDays:number[]; 
    /**
     * 当前需要签到id
     */
    currentDay:number;
}