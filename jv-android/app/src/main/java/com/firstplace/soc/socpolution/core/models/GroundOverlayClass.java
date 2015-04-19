package com.firstplace.soc.socpolution.core.models;

import com.firstplace.soc.socpolution.rest.model.PollutionData;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.GroundOverlay;

/**
 * Created by petar_000 on 4/18/2015.
 */
public class GroundOverlayClass {
    private GroundOverlay groundOverlay;
    private PollutionData pollutionData;
    private Circle circle;

    public Circle getCircle() {
        return circle;
    }

    public void setCircle(Circle circle) {
        this.circle = circle;
    }

    public GroundOverlay getGroundOverlay() {
        return groundOverlay;
    }

    public void setGroundOverlay(GroundOverlay groundOverlay) {
        this.groundOverlay = groundOverlay;
    }

    public PollutionData getPollutionData() {
        return pollutionData;
    }

    public void setPollutionData(PollutionData pollutionData) {
        this.pollutionData = pollutionData;
    }
}
