#include <pebble.h>

#include "appinfo.h"
#include "config.h"

//TODO Change this to use bools where applicable - https://developer.pebble.com/guides/events-and-services/persistent-storage/#versioning-persisted-data
void load_config() {
    config.sunrise = -1;
    config.sunset = -1;
<%= config_defaults %>

    if (persist_exists(APP_KEY_SUNRISE)) {
        config.sunrise = persist_read_int(APP_KEY_SUNRISE);
    }

    if (persist_exists(APP_KEY_SUNSET)) {
        config.sunset = persist_read_int(APP_KEY_SUNSET);
    }

<%= config_reads %>
}

void save_config() {
    persist_write_int(APP_KEY_SUNRISE, config.sunrise);
    persist_write_int(APP_KEY_SUNSET, config.sunset);
<%= config_writes %>
}
