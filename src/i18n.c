#include <pebble.h>

#include "config.h"
#include "ui.h"

void tr_date(struct tm *tick_time) {
    int size = sizeof(ui.texts.date);
    char dow[5];
    strftime(dow, sizeof(dow), "%w", tick_time);

    //Sunday = 0
    if (config.language == 1) { //Hungarian - Thanks to Péter Gróf!
        if (strncmp(dow, "0", 1) == 0) { strftime(ui.texts.date, size, "Vas %e", tick_time); }
        else if (strncmp(dow, "1", 1) == 0) { strftime(ui.texts.date, size, "Hét %e", tick_time); }
        else if (strncmp(dow, "2", 1) == 0) { strftime(ui.texts.date, size, "Kedd %e", tick_time); }
        else if (strncmp(dow, "3", 1) == 0) { strftime(ui.texts.date, size, "Sze %e", tick_time); }
        else if (strncmp(dow, "4", 1) == 0) { strftime(ui.texts.date, size, "Csüt %e", tick_time); }
        else if (strncmp(dow, "5", 1) == 0) { strftime(ui.texts.date, size, "Pén %e", tick_time); }
        else if (strncmp(dow, "6", 1) == 0) { strftime(ui.texts.date, size, "Szo %e", tick_time); }
    }
    else if (config.language == 2) { //Bahasa Malaysia - Thanks to Adrian Chiang!
        if (strncmp(dow, "0", 1) == 0) { strftime(ui.texts.date, size, "Ahd %e", tick_time); }
        else if (strncmp(dow, "1", 1) == 0) { strftime(ui.texts.date, size, "Isn %e", tick_time); }
        else if (strncmp(dow, "2", 1) == 0) { strftime(ui.texts.date, size, "Sel %e", tick_time); }
        else if (strncmp(dow, "3", 1) == 0) { strftime(ui.texts.date, size, "Rab %e", tick_time); }
        else if (strncmp(dow, "4", 1) == 0) { strftime(ui.texts.date, size, "Kha %e", tick_time); }
        else if (strncmp(dow, "5", 1) == 0) { strftime(ui.texts.date, size, "Jum %e", tick_time); }
        else if (strncmp(dow, "6", 1) == 0) { strftime(ui.texts.date, size, "Sab %e", tick_time); }
    }
    else { //Use system language
        strftime(ui.texts.date, size, "%a %e", tick_time);
    }
}

void tr_month(struct tm *tick_time) {
    int size = sizeof(ui.texts.month);

    if (config.language == 1) { //Hungarian
        if (tick_time->tm_mon == 0) { strncpy(ui.texts.month, "Január", size); }
        else if (tick_time->tm_mon == 1) { strncpy(ui.texts.month, "Február", size); }
        else if (tick_time->tm_mon == 2) { strncpy(ui.texts.month, "Március", size); }
        else if (tick_time->tm_mon == 3) { strncpy(ui.texts.month, "Április", size); }
        else if (tick_time->tm_mon == 4) { strncpy(ui.texts.month, "Május", size); }
        else if (tick_time->tm_mon == 5) { strncpy(ui.texts.month, "Június", size); }
        else if (tick_time->tm_mon == 6) { strncpy(ui.texts.month, "Július", size); }
        else if (tick_time->tm_mon == 7) { strncpy(ui.texts.month, "Augusztus", size); }
        else if (tick_time->tm_mon == 8) { strncpy(ui.texts.month, "Szeptember", size); }
        else if (tick_time->tm_mon == 9) { strncpy(ui.texts.month, "Október", size); }
        else if (tick_time->tm_mon == 10) { strncpy(ui.texts.month, "November", size); }
        else if (tick_time->tm_mon == 11) { strncpy(ui.texts.month, "December", size); }
    }
    else if (config.language == 2) { //Bahasa Malaysia
        if (tick_time->tm_mon == 0) { strncpy(ui.texts.month, "Januari", size); }
        else if (tick_time->tm_mon == 1) { strncpy(ui.texts.month, "Febuari", size); }
        else if (tick_time->tm_mon == 2) { strncpy(ui.texts.month, "Mac", size); }
        else if (tick_time->tm_mon == 3) { strncpy(ui.texts.month, "April", size); }
        else if (tick_time->tm_mon == 4) { strncpy(ui.texts.month, "Mei", size); }
        else if (tick_time->tm_mon == 5) { strncpy(ui.texts.month, "Jun", size); }
        else if (tick_time->tm_mon == 6) { strncpy(ui.texts.month, "Julai", size); }
        else if (tick_time->tm_mon == 7) { strncpy(ui.texts.month, "Ogos", size); }
        else if (tick_time->tm_mon == 8) { strncpy(ui.texts.month, "September", size); }
        else if (tick_time->tm_mon == 9) { strncpy(ui.texts.month, "Oktober", size); }
        else if (tick_time->tm_mon == 10) { strncpy(ui.texts.month, "November", size); }
        else if (tick_time->tm_mon == 11) { strncpy(ui.texts.month, "Disember", size); }
    }
    else { //Use system language
        strftime(ui.texts.month, sizeof(ui.texts.month), "%B", tick_time);
    }
}

void tr_am_pm(struct tm *tick_time) {
    int size = sizeof(ui.texts.ampm);

    if (config.language == 1) { //Hungarian
        if (tick_time->tm_hour < 12) { strncpy(ui.texts.ampm, "DE", size); }
        else { strncpy(ui.texts.ampm, "DU", size); }
    }
    else if (config.language == 2) { //Bahasa Malaysia
        if (tick_time->tm_hour < 12) { strncpy(ui.texts.ampm, "PG", size); }
        else { strncpy(ui.texts.ampm, "PT", size); }
    }
    else { //Use system language
        strftime(ui.texts.ampm, sizeof(ui.texts.ampm), "%p", tick_time);
    }
}

void tr_msteps(float msteps) {
    /*if (config.language == 1) { //Hungarian

    }
    else if (config.language == 2) { //Bahasa Malaysia
        //Same as English
    }
    else {*/ //English
        snprintf(ui.texts.steps_short, sizeof(ui.texts.steps_short), "%d.%dm", (int)(msteps), (int)(msteps * 10) % 10);
    //}
}

void tr_ksteps(float ksteps) {
    /*if (config.language == 1) { //Hungarian

    }
    else if (config.language == 2) { //Bahasa Malaysia
        //Same as English
    }
    else {*/ //English
        snprintf(ui.texts.steps_short, sizeof(ui.texts.steps_short), "%d.%dk", (int)(ksteps), (int)(ksteps * 10) % 10);
    //}
}

void tr_kdistance(float distance) {
    /*if (config.language == 1) { //Hungarian

    }
    else if (config.language == 2) { //Bahasa Malaysia
        //Same as English
    }
    else {*/ //English
        snprintf(ui.texts.distance, sizeof(ui.texts.distance), "%d.%dkm", (int)(distance), (int)(distance * 10) % 10);
    //}
}

void tr_midistance(float distance) {
    /*if (config.language == 1) { //Hungarian

    }
    else*/
    if (config.language == 2) { //Bahasa Malaysia
        snprintf(ui.texts.distance, sizeof(ui.texts.distance), "%d.%dba", (int)(distance), (int)(distance * 10) % 10);
    }
    else { //English
        snprintf(ui.texts.distance, sizeof(ui.texts.distance), "%d.%dmi", (int)(distance), (int)(distance * 10) % 10);
    }
}
