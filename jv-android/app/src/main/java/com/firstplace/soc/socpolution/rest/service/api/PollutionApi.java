package com.firstplace.soc.socpolution.rest.service.api;

import com.firstplace.soc.socpolution.rest.model.PollutionData;

import java.util.List;

import retrofit.Callback;
import retrofit.http.GET;
import retrofit.http.Query;

/**
 * Created by petar_000 on 4/18/2015.
 */
public interface PollutionApi {


   // @GET("/json/{sifra}")
  //  void getKatArt(@Path("sifra") String sifraArt,Callback<KatArt> callback);

    @GET("/station/analysis")
    void getListPollutions(@Query("lat1") String lat1,@Query("lat2") String lat2,@Query("lon1") String lon1,@Query("lon2") String lon2,Callback <List<PollutionData>> callback);
}
