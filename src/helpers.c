#include <pebble.h>

void layer_move(Layer *layer, int x, int y) {
    GRect frame = layer_get_frame(layer);
    GPoint point = GPoint(x, y);

    if (!gpoint_equal(&frame.origin, &point)) {
        frame.origin = point;
        layer_set_frame(layer, frame);
    }
}

void text_layer_move(TextLayer *layer, int x, int y) {
    layer_move((Layer *) layer, x, y);
}

void layer_hide(Layer *layer) {
    if (layer != NULL) {
        layer_set_hidden(layer, true);
    }
}

void text_layer_hide(TextLayer *layer) {
    if (layer != NULL) {
        layer_hide((Layer *) layer);
    }
}

void layer_show(Layer *layer) {
    if (layer != NULL) {
        layer_set_hidden(layer, false);
    }
}

void text_layer_show(TextLayer *layer) {
    if (layer != NULL) {
        layer_show((Layer *) layer);
    }
}

Layer *layer_init(Layer *window, GRect frame, LayerUpdateProc update_proc) {
    Layer *layer = layer_create(frame);
    layer_set_update_proc(layer, update_proc);
    layer_add_child(window, layer);

    return layer;
}

TextLayer *text_layer_init(Layer *window, GRect frame, GFont font, GColor background_color, GColor text_color, GTextAlignment alignment) {
    TextLayer *layer = text_layer_create(frame);
    text_layer_set_font(layer, font);
    text_layer_set_background_color(layer, background_color);
    text_layer_set_text_color(layer, text_color);
    text_layer_set_text_alignment(layer, alignment);
    layer_add_child(window, text_layer_get_layer(layer));

    return layer;
}

void layer_destroy_safe(Layer *layer) {
    if (layer != NULL) {
        layer_destroy(layer);
        layer = NULL;
    }
}

void text_layer_destroy_safe(TextLayer *layer) {
    if (layer != NULL) {
        text_layer_destroy(layer);
        layer = NULL;
    }
}

GFont fonts_load_resource_font(uint32_t resource_id) {
    return fonts_load_custom_font(resource_get_handle(resource_id));
}

void fonts_unload_custom_font_safe(GFont font) {
    if (font != NULL) {
        fonts_unload_custom_font(font);
        font = NULL;
    }
}

GColor get_color(int color) {
    #ifdef PBL_COLOR
        if (color == 1) {
            return GColorWhite;
        }
        else {
            return GColorFromHEX(color);
        }
    #else
        if (color == 0) {
            return GColorBlack;
        }
        else if (color == 2) {
            return GColorDarkGray;
        }
        else {
            return GColorWhite;
        }
    #endif
}

