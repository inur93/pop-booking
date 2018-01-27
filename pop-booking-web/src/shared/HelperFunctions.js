

class HelperFunctions {
    constructor() {
        this.addMissingDigit = this.addMissingDigit.bind(this);
        this.getDateAndTimeAsString = this.getDateAndTimeAsString.bind(this);
        this.getDateAsString = this.getDateAsString.bind(this);
        this.formatDate = this.formatDate.bind(this);
    }
    formatDate(date, format) {
        var dateFormat = require('dateformat');
        if(format) return dateFormat(date, format, true);
        return dateFormat(date, "mmmm dS, yyyy, H:MM", true);
    }
    getDateAsStringAndFormat(date) {
        return this.formatDate(date, "mmmm dS, yyyy, H:MM");
    }
    //EEE, dd MMM yyyy HH:mm:ss zzz
    getDateAndTimeAsString(date) {
        var d = this.getDateAsString(date);
        var hh = date.getHours();
        hh = this.addMissingDigit(hh);
        var mm = date.getMinutes();
        mm = this.addMissingDigit(mm);
        //var ss = date.getSeconds();
        //ss = this.addMissingDigit(ss);
        return d + ' ' + hh + ':' + mm;// + ':' + ss;
    }
    getDateAsString(date) {
        if (date || date.getDate) {
            date = new Date(date);
        }
        var dd = date.getDate();
        dd = this.addMissingDigit(dd);
        var mm = date.getMonth() + 1;
        mm = this.addMissingDigit(mm);
        var yyyy = date.getFullYear();


        return yyyy + '-' + mm + '-' + dd;
    }

    addMissingDigit(number) {
        if (number < 10) {
            number = '0' + number;
        }
        return number;
    }

    /**
     * Strips date object to only contain year, month and day
     * @param {*date object} datetime 
     */
    getDateFromDateTime(datetime) {
        var t = datetime.getTime();
        var mod = t % (3600*1000*24);
        return new Date(t-mod);
    }

    /**
     * get time (hours and minutes in seconds) from date object
     * @param {*} datetime 
     */
    getTimeFromMoment(moment) {
        if(!moment) return 0;
        return (moment.hours() * 60 + moment.minutes()) * 60;
    }

    getTimeFromDateTime(datetime) {
        if(!datetime) return 0;
        return (datetime.getHours() * 60 + datetime.getMinutes() + datetime.getTimezoneOffset()) * 60;
    }


    sortTable(tableId, n) {
        if (event) event.preventDefault();
        var table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.getElementById(tableId);
        if (!table) return;

        switching = true;
        //Set the sorting direction to ascending:
        dir = "asc";
        /*Make a loop that will continue until
        no switching has been done:*/
        while (switching) {
            //start by saying: no switching is done:
            switching = false;
            rows = table.getElementsByTagName("TR");
            /*Loop through all table rows (except the
            first, which contains table headers):*/
            for (i = 1; i < (rows.length - 1); i++) {
                //start by saying there should be no switching:
                shouldSwitch = false;
                /*Get the two elements you want to compare,
                one from current row and one from the next:*/
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                /*check if the two rows should switch place,
                based on the direction, asc or desc:*/
                if (dir === "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                } else if (dir === "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        //if so, mark as a switch and break the loop:
                        shouldSwitch = true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                /*If a switch has been marked, make the switch
                and mark that a switch has been done:*/
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                //Each time a switch is done, increase this count by 1:
                switchcount++;
            } else {
                /*If no switching has been done AND the direction is "asc",
                set the direction to "desc" and run the while loop again.*/
                if (switchcount === 0 && dir === "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }
}

export default (new HelperFunctions());