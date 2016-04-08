#pragma once

#include <pebble.h>

#include "config.h"
#include "ui.h"

void tr_date(struct tm *tick_time);
void tr_month(struct tm *tick_time);
void tr_am_pm(struct tm *tick_time);
void tr_msteps(float msteps);
void tr_ksteps(float ksteps);
void tr_kdistance(float distance);
void tr_midistance(float distance);
