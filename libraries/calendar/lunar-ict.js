
'use strict';

Number.prototype.toInt = function(){
    return Math.floor(this);
};


/* Create lunar date object, stores (lunar) date, month, year, leap month indicator, and Julian date number */
function LunarDate(dd, mm, yy, leap, jd) {
    this.day = dd;
    this.month = mm;
    this.year = yy;
    this.leap = leap;
    this.jd = jd;
}
const ThienCan = ['Giáp', 'ất', 'Bính', 'đinh', 'mậu', 'kỷ', 'Canh', 'tân', 'Nhâm', 'Quí'],
      DiaChi = ['Tý', 'sửu', 'dần', 'mão', 'thìn', 'tỵ', 'ngọ', 'mùi', 'thân', 'dậu', 'tuất', 'hợi'],
      GioHoangDao = ["110100101100", "001101001011", "110011010010", "101100110100", "001011001101", "010010110011"],
      TietKhi = ["Xu\u00E2n ph\u00E2n", "Thanh minh", "C\u1ED1c v\u0169", "L\u1EADp h\u1EA1", "Ti\u1EC3u m\u00E3n", "Mang ch\u1EE7ng",
            "H\u1EA1 ch\u00ED", "Ti\u1EC3u th\u1EED", "\u0110\u1EA1i th\u1EED", "L\u1EADp thu", "X\u1EED th\u1EED", "B\u1EA1ch l\u1ED9",
            "Thu ph\u00E2n", "H\u00E0n l\u1ED9", "S\u01B0\u01A1ng gi\u00E1ng", "L\u1EADp \u0111\u00F4ng", "Ti\u1EC3u tuy\u1EBFt", "\u0110\u1EA1i tuy\u1EBFt",
            "\u0110\u00F4ng ch\u00ED", "Ti\u1EC3u h\u00E0n", "\u0110\u1EA1i h\u00E0n", "L\u1EADp xu\u00E2n", "V\u0169 Th\u1EE7y", "Kinh tr\u1EADp"
        ];

const TK19 = [
    0x30baa3, 0x56ab50, 0x422ba0, 0x2cab61, 0x52a370, 0x3c51e8, 0x60d160, 0x4ae4b0, 0x376926, 0x58daa0,
    0x445b50, 0x3116d2, 0x562ae0, 0x3ea2e0, 0x28e2d2, 0x4ec950, 0x38d556, 0x5cb520, 0x46b690, 0x325da4,
    0x5855d0, 0x4225d0, 0x2ca5b3, 0x52a2b0, 0x3da8b7, 0x60a950, 0x4ab4a0, 0x35b2a5, 0x5aad50, 0x4455b0,
    0x302b74, 0x562570, 0x4052f9, 0x6452b0, 0x4e6950, 0x386d56, 0x5e5aa0, 0x46ab50, 0x3256d4, 0x584ae0,
    0x42a570, 0x2d4553, 0x50d2a0, 0x3be8a7, 0x60d550, 0x4a5aa0, 0x34ada5, 0x5a95d0, 0x464ae0, 0x2eaab4,
    0x54a4d0, 0x3ed2b8, 0x64b290, 0x4cb550, 0x385757, 0x5e2da0, 0x4895d0, 0x324d75, 0x5849b0, 0x42a4b0,
    0x2da4b3, 0x506a90, 0x3aad98, 0x606b50, 0x4c2b60, 0x359365, 0x5a9370, 0x464970, 0x306964, 0x52e4a0,
    0x3cea6a, 0x62da90, 0x4e5ad0, 0x392ad6, 0x5e2ae0, 0x4892e0, 0x32cad5, 0x56c950, 0x40d4a0, 0x2bd4a3,
    0x50b690, 0x3a57a7, 0x6055b0, 0x4c25d0, 0x3695b5, 0x5a92b0, 0x44a950, 0x2ed954, 0x54b4a0, 0x3cb550,
    0x286b52, 0x4e55b0, 0x3a2776, 0x5e2570, 0x4852b0, 0x32aaa5, 0x56e950, 0x406aa0, 0x2abaa3, 0x50ab50
]; /* Years 2000-2099 */

const TK20 = [
    0x3c4bd8, 0x624ae0, 0x4ca570, 0x3854d5, 0x5cd260, 0x44d950, 0x315554, 0x5656a0, 0x409ad0, 0x2a55d2,
    0x504ae0, 0x3aa5b6, 0x60a4d0, 0x48d250, 0x33d255, 0x58b540, 0x42d6a0, 0x2cada2, 0x5295b0, 0x3f4977,
    0x644970, 0x4ca4b0, 0x36b4b5, 0x5c6a50, 0x466d50, 0x312b54, 0x562b60, 0x409570, 0x2c52f2, 0x504970,
    0x3a6566, 0x5ed4a0, 0x48ea50, 0x336a95, 0x585ad0, 0x442b60, 0x2f86e3, 0x5292e0, 0x3dc8d7, 0x62c950,
    0x4cd4a0, 0x35d8a6, 0x5ab550, 0x4656a0, 0x31a5b4, 0x5625d0, 0x4092d0, 0x2ad2b2, 0x50a950, 0x38b557,
    0x5e6ca0, 0x48b550, 0x355355, 0x584da0, 0x42a5b0, 0x2f4573, 0x5452b0, 0x3ca9a8, 0x60e950, 0x4c6aa0,
    0x36aea6, 0x5aab50, 0x464b60, 0x30aae4, 0x56a570, 0x405260, 0x28f263, 0x4ed940, 0x38db47, 0x5cd6a0,
    0x4896d0, 0x344dd5, 0x5a4ad0, 0x42a4d0, 0x2cd4b4, 0x52b250, 0x3cd558, 0x60b540, 0x4ab5a0, 0x3755a6,
    0x5c95b0, 0x4649b0, 0x30a974, 0x56a4b0, 0x40aa50, 0x29aa52, 0x4e6d20, 0x39ad47, 0x5eab60, 0x489370,
    0x344af5, 0x5a4970, 0x4464b0, 0x2c74a3, 0x50ea50, 0x3d6a58, 0x6256a0, 0x4aaad0, 0x3696d5, 0x5c92e0
]; /* Years 1900-1999 */

const TK21 = [
    0x46c960, 0x2ed954, 0x54d4a0, 0x3eda50, 0x2a7552, 0x4e56a0, 0x38a7a7, 0x5ea5d0, 0x4a92b0, 0x32aab5,
    0x58a950, 0x42b4a0, 0x2cbaa4, 0x50ad50, 0x3c55d9, 0x624ba0, 0x4ca5b0, 0x375176, 0x5c5270, 0x466930,
    0x307934, 0x546aa0, 0x3ead50, 0x2a5b52, 0x504b60, 0x38a6e6, 0x5ea4e0, 0x48d260, 0x32ea65, 0x56d520,
    0x40daa0, 0x2d56a3, 0x5256d0, 0x3c4afb, 0x6249d0, 0x4ca4d0, 0x37d0b6, 0x5ab250, 0x44b520, 0x2edd25,
    0x54b5a0, 0x3e55d0, 0x2a55b2, 0x5049b0, 0x3aa577, 0x5ea4b0, 0x48aa50, 0x33b255, 0x586d20, 0x40ad60,
    0x2d4b63, 0x525370, 0x3e49e8, 0x60c970, 0x4c54b0, 0x3768a6, 0x5ada50, 0x445aa0, 0x2fa6a4, 0x54aad0,
    0x4052e0, 0x28d2e3, 0x4ec950, 0x38d557, 0x5ed4a0, 0x46d950, 0x325d55, 0x5856a0, 0x42a6d0, 0x2c55d4,
    0x5252b0, 0x3ca9b8, 0x62a930, 0x4ab490, 0x34b6a6, 0x5aad50, 0x4655a0, 0x2eab64, 0x54a570, 0x4052b0,
    0x2ab173, 0x4e6930, 0x386b37, 0x5e6aa0, 0x48ad50, 0x332ad5, 0x582b60, 0x42a570, 0x2e52e4, 0x50d160,
    0x3ae958, 0x60d520, 0x4ada90, 0x355aa6, 0x5a56d0, 0x462ae0, 0x30a9d4, 0x54a2d0, 0x3ed150, 0x28e952
]; /* Years 2000-2099 */

const TK22 = [
    0x4eb520, 0x38d727, 0x5eada0, 0x4a55b0, 0x362db5, 0x5a45b0, 0x44a2b0, 0x2eb2b4, 0x54a950, 0x3cb559,
    0x626b20, 0x4cad50, 0x385766, 0x5c5370, 0x484570, 0x326574, 0x5852b0, 0x406950, 0x2a7953, 0x505aa0,
    0x3baaa7, 0x5ea6d0, 0x4a4ae0, 0x35a2e5, 0x5aa550, 0x42d2a0, 0x2de2a4, 0x52d550, 0x3e5abb, 0x6256a0,
    0x4c96d0, 0x3949b6, 0x5e4ab0, 0x46a8d0, 0x30d4b5, 0x56b290, 0x40b550, 0x2a6d52, 0x504da0, 0x3b9567,
    0x609570, 0x4a49b0, 0x34a975, 0x5a64b0, 0x446a90, 0x2cba94, 0x526b50, 0x3e2b60, 0x28ab61, 0x4c9570,
    0x384ae6, 0x5cd160, 0x46e4a0, 0x2eed25, 0x54da90, 0x405b50, 0x2c36d3, 0x502ae0, 0x3a93d7, 0x6092d0,
    0x4ac950, 0x32d556, 0x58b4a0, 0x42b690, 0x2e5d94, 0x5255b0, 0x3e25fa, 0x6425b0, 0x4e92b0, 0x36aab6,
    0x5c6950, 0x4674a0, 0x31b2a5, 0x54ad50, 0x4055a0, 0x2aab73, 0x522570, 0x3a5377, 0x6052b0, 0x4a6950,
    0x346d56, 0x585aa0, 0x42ab50, 0x2e56d4, 0x544ae0, 0x3ca570, 0x2864d2, 0x4cd260, 0x36eaa6, 0x5ad550,
    0x465aa0, 0x30ada5, 0x5695d0, 0x404ad0, 0x2aa9b3, 0x50a4d0, 0x3ad2b7, 0x5eb250, 0x48b540, 0x33d556
]; /* Years 2100-2199 */


class lunarDate{
    constructor(dateStr) {
        if( typeof dateStr === 'undefined'){
            this.solarDate = moment();
        } else {
            this.solarDate = dateStr;
        }
        let dateCurrent = this.solarDate;
        this.dateName = [];
        this.gioHoangDao = [];

        this.firstDay = this.jdn(25, 1, 1800); // Tet am lich 1800
        this.lastDay  = this.jdn(31, 12, 2199);

        this.lunarDate = this.getLunarDate(dateCurrent.date(), dateCurrent.month()+1, dateCurrent.year());
        this.getDayInfo();
    }

    getYearInfo(yyyy) {
        let yearCode;
        if (yyyy < 1900) {
            yearCode = TK19[yyyy - 1800];
        } else if (yyyy < 2000) {
            yearCode = TK20[yyyy - 1900];
        } else if (yyyy < 2100) {
            yearCode = TK21[yyyy - 2000];
        } else {
            yearCode = TK22[yyyy - 2100];
        }
        return this.decodeLunarYear(yyyy, yearCode);
    }

    decodeLunarYear(yy, k) {
        let monthLengths, regularMonths, offsetOfTet, leapMonth, leapMonthLength, solarNY, currentJD, j, mm;
        let ly = [];
        monthLengths = [29, 30];
        regularMonths = [12];
        offsetOfTet = k >> 17;
        leapMonth = k & 0xf;
        leapMonthLength = monthLengths[k >> 16 & 0x1];
        solarNY = this.jdn(1, 1, yy);
        currentJD = solarNY+offsetOfTet;
        j = k >> 4;
        for(let i = 0; i < 12; i++) {
            regularMonths[12 - i - 1] = monthLengths[j & 0x1];
            j >>= 1;
        }
        if (leapMonth === 0) {
            for(mm = 1; mm <= 12; mm++) {
                ly.push(new LunarDate(1, mm, yy, 0, currentJD));
                currentJD += regularMonths[mm-1];
            }
        } else {
            for(mm = 1; mm <= leapMonth; mm++) {
                ly.push(new LunarDate(1, mm, yy, 0, currentJD));
                currentJD += regularMonths[mm-1];
            }
            ly.push(new LunarDate(1, leapMonth, yy, 1, currentJD));
            currentJD += leapMonthLength;
            for(mm = leapMonth+1; mm <= 12; mm++) {
                ly.push(new LunarDate(1, mm, yy, 0, currentJD));
                currentJD += regularMonths[mm-1];
            }
        }
        return ly;
    }

    getLunarDate(dd, mm, yyyy) {
        let ly, jd;
        if (yyyy < 1800 || 2199 < yyyy) {
            //return new LunarDate(0, 0, 0, 0, 0);
        }
        ly = this.getYearInfo(yyyy);
        jd = this.jdn(dd, mm, yyyy);
        if (jd < ly[0].jd) {
            ly = this.getYearInfo(yyyy - 1);
        }
        return this.findLunarDate(jd, ly);
    }

    jdn(dd, mm, yy) {
        let a = ((14 - mm) / 12).toInt(),
            y = yy+4800-a,
            m = mm+12*a-3;
        return dd + ((153*m+2)/5).toInt() + 365*y + (y/4).toInt() - (y/100).toInt() + (y/400).toInt() - 32045;

        //return 367*yy - INT(7*(yy+INT((mm+9)/12))/4) - INT(3*(INT((yy+(mm-9)/7)/100)+1)/4) + INT(275*mm/9)+dd+1721029;
    }

    findLunarDate(jd, ly) {
        if (jd > this.lastDay || jd < this.firstDay || ly[0].jd > jd) {
            return new LunarDate(0, 0, 0, 0, jd);
        }
        let i = ly.length-1;
        while (jd < ly[i].jd) {
            i--;
        }
        let off = jd - ly[i].jd;
        return new LunarDate(ly[i].day+off, ly[i].month, ly[i].year, ly[i].leap, jd);
    }

    getCanChi() {
        let dayName, monthName, yearName, lunarDate = this.lunarDate;
        dayName = ThienCan[(lunarDate.jd + 9) % 10] + " " + DiaChi[(lunarDate.jd+1)%12];
        monthName = ThienCan[(lunarDate.year*12+lunarDate.month+3) % 10] + " " + DiaChi[(lunarDate.month+1)%12];
        if (lunarDate.leap === 1) {
            monthName += " (nhuận)";
        }
        yearName = this.getYearCanChi(lunarDate.year);
        return [dayName, monthName, yearName];
    }

    getYearCanChi(year) {
        return ThienCan[(year+6) % 10] + " " + DiaChi[(year+8) % 12];
    }

    /*
     * Can cua gio Chinh Ty (00:00) cua ngay voi JDN nay
     */

    getCanHour0(jdn) {
        return ThienCan[(jdn-1)*2 % 10];
    }

    getGioHoangDao(jd) {
        let chiOfDay = (jd+1) % 12,
            gioHD = GioHoangDao[chiOfDay % 6]; // same values for Ty' (1) and Ngo. (6), for Suu and Mui etc.
            // ret = "",
            // count = 0;

        for (let i = 0; i < 12; i++) {
            if (gioHD.charAt(i) === '1') {
                this.gioHoangDao[(i*2+23)%24+'-'+(i*2+1)%24] = DiaChi[i];
                //     ret += DiaChi[i];
                // ret += ' ('+(i*2+23)%24+'-'+(i*2+1)%24+')';
                //
                // if (count++ < 5) ret += ', ';
                // if (count === 3) ret += '\n';
            }
        }
        return true;
    }


    /* Compute the longitude of the sun at any time.
     * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
     * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
     */
    sunLongitude(jdn) {
        let T, T2, dr, M, L0, DL, lambda, theta, omega,
        PI = Math.PI;
        T = (jdn - 2451545.0 ) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
        T2 = T*T;
        dr = PI/180; // degree to radian
        M = 357.52910 + 35999.05030*T - 0.0001559*T2 - 0.00000048*T*T2; // mean anomaly, degree
        L0 = 280.46645 + 36000.76983*T + 0.0003032*T2; // mean longitude, degree
        DL = (1.914600 - 0.004817*T - 0.000014*T2)*Math.sin(dr*M);
        DL = DL + (0.019993 - 0.000101*T)*Math.sin(dr*2*M) + 0.000290*Math.sin(dr*3*M);
        theta = L0 + DL; // true longitude, degree
        // obtain apparent longitude by correcting for nutation and aberration
        omega = 125.04 - 1934.136 * T;
        lambda = theta - 0.00569 - 0.00478 * Math.sin(omega * dr);
        // Convert to radians
        lambda = lambda*dr;
        lambda = lambda - PI*2*((lambda/(PI*2)).toInt()); // Normalize to (0, 2*PI)
        return lambda;
    }

    /* Compute the sun segment at start (00:00) of the day with the given integral Julian day number.
     * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
     * The function returns a number between 0 and 23.
     * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
     * After that, return 1, 2, 3 ...
     */
    getSunLongitude(dayNumber, timeZone) {
        let PI = Math.PI;
        return ( this.sunLongitude(dayNumber - 0.5 - timeZone/24.0) / PI * 12).toInt();
    }

    getDayName() {
        if (this.lunarDate.day === 0) {
            return "";
        }
        let cc = this.getCanChi();
        this.dateName = {
            day : cc[0],
            month : cc[1],
            year : cc[2]
        };
        return true;
    }


    getDayString(lunar, solarDay, solarMonth, solarYear) {
        let s,
            //dayOfWeek = TUAN[(lunar.jd + 1) % 7],
            dayOfWeek = this.solarDate.day()
            ;
        s = dayOfWeek + " " + this.solarDate.format('DD/MM/YYYY');
        s += " -+- ";
        s = s + "ngày " + lunar.day+" tháng "+lunar.month;
        if (lunar.leap === 1) {
            s = s + " nhu\u1EADn";
        }
        return s;
    }

    getDayInfo(){
        //var lunar = new LunarDate(dd, mm, yy, leap, jd);
        let jd = this.lunarDate.jd,
            sday = this.solarDate.date(),
            smonth = this.solarDate.month(),
            syear = this.solarDate.year(),
            sunLon = this.getSunLongitude(jd+1, 7.0);

        this.gioDauNgay = this.getCanHour0(jd)+" "+ DiaChi[0];
        this.getGioHoangDao(jd);
        this.tietKhi = TietKhi[sunLon];
        this.getDayName();
    }
    get dayFullname(){
        return "ngày "+this.dateName.day + ", tháng " + this.dateName.month + ", năm " + this.dateName.year +" ("+this.lunarDate.day+'/'+this.lunarDate.month+'/'+this.lunarDate.year+")";
    }
}

const getLunar = function(date){
    return new lunarDate(date);
};
module.exports = {getLunar};

