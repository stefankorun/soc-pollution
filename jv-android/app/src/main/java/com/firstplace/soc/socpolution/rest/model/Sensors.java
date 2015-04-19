package com.firstplace.soc.socpolution.rest.model;

/**
 * Created by petar_000 on 4/19/2015.
 */
public class Sensors {


    private Integer temperature;

    private Integer nitrogen;

    private Integer humidity;

    public Integer getTemperature() {
        return temperature;
    }

    public void setTemperature(Integer temperature) {
        this.temperature = temperature;
    }

    public Integer getNitrogen() {
        return nitrogen;
    }

    public void setNitrogen(Integer nitrogen) {
        this.nitrogen = nitrogen;
    }

    public Integer getHumidity() {
        return humidity;
    }

    public void setHumidity(Integer humidity) {
        this.humidity = humidity;
    }
}
