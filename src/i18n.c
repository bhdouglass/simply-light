#include <pebble.h>

#include "config.h"
#include "ui.h"

void tr_date(struct tm *tick_time) {
    int size = sizeof(ui.texts.date);
    char dow[5];
    strftime(dow, sizeof(dow), "%w", tick_time);

    if (config.language == 1) { //Hungarian
        if (strncmp(dow, "0", 1) == 0) {
            strftime(ui.texts.date, size, "Vas %e", tick_time);
        }
        else if (strncmp(dow, "1", 1) == 0) {
            strftime(ui.texts.date, size, "Hét %e", tick_time);
        }
        else if (strncmp(dow, "2", 1) == 0) {
            strftime(ui.texts.date, size, "Kedd %e", tick_time);
        }
        else if (strncmp(dow, "3", 1) == 0) {
            strftime(ui.texts.date, size, "Sze %e", tick_time);
        }
        else if (strncmp(dow, "4", 1) == 0) {
            strftime(ui.texts.date, size, "Csüt %e", tick_time);
        }
        else if (strncmp(dow, "5", 1) == 0) {
            strftime(ui.texts.date, size, "Pén %e", tick_time);
        }
        else if (strncmp(dow, "6", 1) == 0) {
            strftime(ui.texts.date, size, "Szo %e", tick_time);
        }
    }
    else { //Use system language
        strftime(ui.texts.date, size, "%a %e", tick_time);
    }
}

void tr_month(struct tm *tick_time) {
    int size = sizeof(ui.texts.month);

    if (config.language == 1) { //Hungarian
        if (tick_time->tm_mon == 0) {
            strncpy(ui.texts.month, "Január", size);
        }
        else if (tick_time->tm_mon == 1) {
            strncpy(ui.texts.month, "Február", size);
        }
        else if (tick_time->tm_mon == 2) {
            strncpy(ui.texts.month, "Március", size);
        }
        else if (tick_time->tm_mon == 3) {
            strncpy(ui.texts.month, "Április", size);
        }
        else if (tick_time->tm_mon == 4) {
            strncpy(ui.texts.month, "Május", size);
        }
        else if (tick_time->tm_mon == 5) {
            strncpy(ui.texts.month, "Június", size);
        }
        else if (tick_time->tm_mon == 6) {
            strncpy(ui.texts.month, "Július", size);
        }
        else if (tick_time->tm_mon == 7) {
            strncpy(ui.texts.month, "Augusztus", size);
        }
        else if (tick_time->tm_mon == 8) {
            strncpy(ui.texts.month, "Szeptember", size);
        }
        else if (tick_time->tm_mon == 9) {
            strncpy(ui.texts.month, "Október", size);
        }
        else if (tick_time->tm_mon == 10) {
            strncpy(ui.texts.month, "November", size);
        }
        else if (tick_time->tm_mon == 11) {
            strncpy(ui.texts.month, "December", size);
        }
    }
    else { //Use system language
        strftime(ui.texts.month, sizeof(ui.texts.month), "%B", tick_time);
    }
}

void tr_am_pm(struct tm *tick_time) {
    int size = sizeof(ui.texts.am_pm);

    if (config.language == 1) { //Hungarian
        if (tick_time->tm_hour < 12) {
            strncpy(ui.texts.am_pm, "DE", size);
        }
        else {
            strncpy(ui.texts.am_pm, "DU", size);
        }
    }
    else { //Use system language
        strftime(ui.texts.am_pm, sizeof(ui.texts.am_pm), "%p", tick_time);
    }
}
