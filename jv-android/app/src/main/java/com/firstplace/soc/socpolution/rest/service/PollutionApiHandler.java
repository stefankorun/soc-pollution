package com.firstplace.soc.socpolution.rest.service;

import com.firstplace.soc.socpolution.rest.service.api.PollutionApi;

import retrofit.RestAdapter;

/**
 * Created by petar_000 on 4/18/2015.
 */
public class PollutionApiHandler {
    private static final String API_URL ="http://192.168.0.106:3000";
    private static RestAdapter restAdapter;

    private static  RestAdapter getRestAdapter(){
        if(restAdapter==null){
            restAdapter = new RestAdapter.Builder()
                    .setLogLevel(RestAdapter.LogLevel.BASIC)
                    .setEndpoint(API_URL)
                            //.GsonBuilder.excludeFieldsWithoutExposeAnnotation()
                    .build();
        }
        return restAdapter;
    }

    public static PollutionApi getApiInterface(){

        // Create an instance of our  API interface.
        PollutionApi pollutionApi =null;
        try {
            if(restAdapter==null){
                restAdapter=getRestAdapter();
            }
            pollutionApi = restAdapter.create(PollutionApi.class);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return pollutionApi;
    }

}
