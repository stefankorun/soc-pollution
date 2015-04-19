package com.firstplace.soc.socpolution.rest.model;

import com.google.gson.annotations.SerializedName;

/**
 * Created by petar_000 on 4/18/2015.
 */
public class PollutionData {
    @SerializedName("lat")
    private String latitude;
    @SerializedName("lon")
    private String longitude;

    @SerializedName("_id")

    private String Id;

    private Sensors sensors;

    private Integer qos;

    private String timestamp;

    public String getLatitude() {
        return latitude;
    }

    public void setLatitude(String latitude) {
        this.latitude = latitude;
    }

    public String getLongitude() {
        return longitude;
    }

    public void setLongitude(String longitude) {
        this.longitude = longitude;
    }

    public String getId() {
        return Id;
    }

    public void setId(String id) {
        Id = id;
    }

    public Sensors getSensors() {
        return sensors;
    }

    public void setSensors(Sensors sensors) {
        this.sensors = sensors;
    }

    public Integer getQos() {
        return qos;
    }

    public void setQos(Integer qos) {
        this.qos = qos;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
