#pragma once

#include <pebble.h>

#include "config.h"
#include "ui.h"

void tr_date(struct tm *tick_time);
void tr_month(struct tm *tick_time);
void tr_am_pm(struct tm *tick_time);
