package com.firstplace.soc.socpolution.ui.activity;

import android.content.Context;
import android.content.res.Configuration;
import android.location.Criteria;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.widget.DrawerLayout;
import android.support.v7.app.ActionBarActivity;
import android.support.v7.app.ActionBarDrawerToggle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ListView;
import android.widget.Toast;

import com.firstplace.soc.socpolution.R;
import com.firstplace.soc.socpolution.core.models.GroundOverlayClass;
import com.firstplace.soc.socpolution.rest.model.PollutionData;
import com.firstplace.soc.socpolution.rest.service.PollutionApiHandler;
import com.firstplace.soc.socpolution.rest.service.api.PollutionApi;
import com.firstplace.soc.socpolution.ui.adapter.MenuAdapter;
import com.firstplace.soc.socpolution.ui.adapter.NavDrawerItem;
import com.google.android.gms.maps.CameraUpdateFactory;
import com.google.android.gms.maps.GoogleMap;
import com.google.android.gms.maps.MapFragment;
import com.google.android.gms.maps.model.CameraPosition;
import com.google.android.gms.maps.model.Circle;
import com.google.android.gms.maps.model.CircleOptions;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.maps.model.LatLngBounds;

import java.util.ArrayList;
import java.util.List;

import retrofit.Callback;
import retrofit.RetrofitError;
import retrofit.client.Response;

/**
 * Created by petar_000 on 4/18/2015.
 */
public class MapDrawer extends ActionBarActivity implements LocationListener {

    private ListView mDrawerList;
    private DrawerLayout mDrawerLayout;
    private MenuAdapter mAdapter;
    private ActionBarDrawerToggle mDrawerToggle;
    private String mActivityTitle;
    private Boolean callOver;


    private final static String TAG = MapDrawer.class.getSimpleName();

    private static final LatLng OHRID = new LatLng(41.1131460, 20.8024810);
    private GoogleMap map;

    //holds the current location of user
    private Location location;

    //list of objects. One object contains objects pollution from server for one location
    private List<PollutionData> pollutionDataList;

    //list of objects. One object contains type PollutionData and second object of type GroundOverlay
    private List<GroundOverlayClass> groundOverlayList;

    private LocationManager locationManager;
    private String provider;

    private double lat;
    private double lng;

    //Initialize to a non-valid zoom value
    private float previousZoomLevel = -1.0f;

    private boolean isZooming = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.map_drawer);


        init();
        createEvents();
        //  getDataFromRestTest();


    }

    private void addDrawerItems() {

        ArrayList<NavDrawerItem> list = new ArrayList<NavDrawerItem>();
        NavDrawerItem navDrawerItem1 = new NavDrawerItem(R.drawable.blueoverlay, "All", false);
        NavDrawerItem navDrawerItem2 = new NavDrawerItem(R.drawable.blueoverlay, "Temp", false);
        NavDrawerItem navDrawerItem3 = new NavDrawerItem(R.drawable.blueoverlay, "Nitrogen", false);
        NavDrawerItem navDrawerItem4 = new NavDrawerItem(R.drawable.blueoverlay, "Oxygen", false);
        NavDrawerItem navDrawerItem5 = new NavDrawerItem(R.drawable.blueoverlay, "Argon", false);
        NavDrawerItem navDrawerItem6 = new NavDrawerItem(R.drawable.blueoverlay, "dust", false);


        list.add(navDrawerItem1);
        list.add(navDrawerItem2);
        list.add(navDrawerItem3);
        list.add(navDrawerItem4);
        list.add(navDrawerItem5);
        list.add(navDrawerItem6);

        list.get(0).selected = true;


        //MenuAdapter ad=new MenuAdapter(this,R.layout.drawer_list_item,list);
        mAdapter = new MenuAdapter(this, R.layout.drawer_list_item, list);
        mDrawerList.setAdapter(mAdapter);

    }

    private void setupDrawer() {
        mDrawerToggle = new ActionBarDrawerToggle(this, mDrawerLayout, R.string.menu_open_title, R.string.menu_closed_title) {

            /** Called when a drawer has settled in a completely open state. */
            public void onDrawerOpened(View drawerView) {
                super.onDrawerOpened(drawerView);
                getSupportActionBar().setTitle(R.string.menu_open_title);
                // getSupportActionBar().setCustomView(R.layout.action_bar_custom_view);

                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }

            /** Called when a drawer has settled in a completely closed state. */
            public void onDrawerClosed(View view) {
                super.onDrawerClosed(view);
                getSupportActionBar().setTitle(R.string.menu_closed_title);
                // getSupportActionBar().setCustomView(R.layout.action_bar_custom_view);
                invalidateOptionsMenu(); // creates call to onPrepareOptionsMenu()
            }
        };

        mDrawerToggle.setDrawerIndicatorEnabled(true);
        mDrawerLayout.setDrawerListener(mDrawerToggle);
    }

    @Override
    protected void onPostCreate(Bundle savedInstanceState) {
        super.onPostCreate(savedInstanceState);
        // Sync the toggle state after onRestoreInstanceState has occurred.
        mDrawerToggle.syncState();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        mDrawerToggle.onConfigurationChanged(newConfig);
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        // Activate the navigation drawer toggle
        if (mDrawerToggle.onOptionsItemSelected(item)) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void init() {
        callOver = false;

        //init arrayList
        groundOverlayList = new ArrayList<GroundOverlayClass>();

        //init map
        map = ((MapFragment) getFragmentManager().findFragmentById(R.id.mapDrawer))
                .getMap();

        pollutionDataList = new ArrayList<PollutionData>();

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        // Define the criteria how to select the locatioin provider -> use
        // default
        Criteria criteria = new Criteria();
        provider = locationManager.getBestProvider(criteria, false);

        Location location = locationManager.getLastKnownLocation(provider);

        if (location != null) {
            System.out.println("Provider " + provider + " has been selected.");
            onLocationChanged(location);
        } else {
            System.out.println("Location not avilable");
        }


        mDrawerList = (ListView) findViewById(R.id.navList);
        mDrawerLayout = (DrawerLayout) findViewById(R.id.drawer_layout);
        mActivityTitle = getTitle().toString();

        addDrawerItems();
        setupDrawer();
        getSupportActionBar().setTitle(R.string.menu_closed_title);
        //getSupportActionBar().setCustomView(R.layout.action_bar_custom_view);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setHomeButtonEnabled(true);
    }

    /*
    creating button events ,listeners ...
     */
    public void createEvents() {


        mDrawerList.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @Override
            public void onItemClick(AdapterView<?> parent, View view, int position, long id) {


                for (int i = 0; i < mAdapter.getCount(); i++) {
                    mAdapter.getItem(i).selected = false;
                }
                mAdapter.getItem(position).selected = true;
                mAdapter.notifyDataSetChanged();

                updateMap(position);
                //Toast.makeText(MapDrawer.this, "Time for an upgrade!", Toast.LENGTH_SHORT).show();
            }
        });
        map.setOnMapLoadedCallback(new GoogleMap.OnMapLoadedCallback() {
            @Override
            public void onMapLoaded() {
                map.moveCamera(CameraUpdateFactory.newLatLngZoom(new LatLng(location.getLatitude(), location.getLongitude()), 13));
                // Zoom in, animating the camera.
                //  map.animateCamera(CameraUpdateFactory.zoomTo(15), 2000, null);

                LatLngBounds curScreen = map.getProjection()
                        .getVisibleRegion().latLngBounds;


                getDataFromRest(curScreen.southwest.latitude, curScreen.northeast.latitude, curScreen.northeast.longitude, curScreen.southwest.longitude);

            }
        });

        map.setOnCameraChangeListener(new GoogleMap.OnCameraChangeListener() {
            @Override
            public void onCameraChange(CameraPosition cameraPosition) {
                Log.d(TAG,"zoom level"+cameraPosition.zoom);
                if(previousZoomLevel != cameraPosition.zoom)
                {
                    isZooming = true;
                }else if(callOver){
                    Toast.makeText(MapDrawer.this, "zooming over ", Toast.LENGTH_SHORT).show();
                    LatLngBounds curScreen = map.getProjection()
                            .getVisibleRegion().latLngBounds;


                    getDataFromRest(curScreen.southwest.latitude, curScreen.northeast.latitude, curScreen.northeast.longitude, curScreen.southwest.longitude);

                }

                previousZoomLevel = cameraPosition.zoom;
            }
        });
    }

    /*
    creating google map
     */
    public void getDataFromRest(Double lat1, Double lat2, Double lon1, Double lon2) {

        String lat1_str, lat2_str, lon1_str, lon2_str;
        lat1_str = String.valueOf(location.getLatitude());
        lat2_str = String.valueOf(location.getLatitude());

        lon1_str = String.valueOf(location.getLongitude());
        lon2_str = String.valueOf(location.getLongitude());
        callOver = false;
        PollutionApi pollutionApi = PollutionApiHandler.getApiInterface();

        pollutionApi.getListPollutions(lat1_str, lat2_str, lon1_str, lon2_str, new Callback<List<PollutionData>>() {
            @Override
            public void success(List<PollutionData> pollutionDataList1, Response response) {
                callOver = true;
                pollutionDataList = pollutionDataList1;

                populateMap();
                // getDataFromRestTest();
                Toast.makeText(MapDrawer.this, "Data from rest ", Toast.LENGTH_SHORT).show();
            }

            @Override
            public void failure(RetrofitError retrofitError) {
                callOver = true;
                Toast.makeText(MapDrawer.this, "failure ", Toast.LENGTH_SHORT).show();
            }
        });
    }

    public void getDataFromRestTest() {
        PollutionData item;
        Double latitude = 41.1131460;
        Double longitude = 20.8024810;

        for (int i = 0; i < 20; i++) {
            item = new PollutionData();
            item.setLatitude(String.valueOf(latitude));
            item.setLongitude(String.valueOf(longitude));

            pollutionDataList.add(item);

            latitude += 0.0007;
            longitude += 0.0007;
        }

        populateMap();
    }

    /*
    creating the map and adding all the overlays
     */
    public void populateMap() {


        for (int i = 0; i < pollutionDataList.size(); i++) {
            addOverlay(pollutionDataList.get(i));

        }


    }

    /*
    add one overlay(colored rectangle) on the map
     */

    public void addOverlay(PollutionData pollutionData) {

        double latitude = Double.valueOf(pollutionData.getLatitude());//.;
        double longitude = Double.valueOf(pollutionData.getLongitude());
        LatLng latLng = new LatLng( latitude,longitude);

        //latLng=new LatLng(location.getLatitude(),location.getLongitude());
        //create overlay
       /* GroundOverlayOptions newarkMap = new GroundOverlayOptions()
                .image(BitmapDescriptorFactory.fromResource(R.drawable.blueoverlay))
                .position(new LatLng(latitude,longitude), 1000f, 1000f)
                .transparency(0.1f);*/

        // Instantiating CircleOptions to draw a circle around the marker
        CircleOptions circleOptions = new CircleOptions();

        // Specifying the center of the circle
        circleOptions.center(latLng);


        // Radius of the circle
        circleOptions.radius(pollutionData.getQos() * 6);

        // Border color of the circle
        //circleOptions.strokeColor(0x5500ff00);

        // Fill color of the circle
        // 0x represents, this is an hexadecimal code
        // 55 represents percentage of transparency. For 100% transparency, specify 00.
        // For 0% transparency ( ie, opaque ) , specify ff
        // The remaining 6 characters(00ff00) specify the fill color
        circleOptions.fillColor(0x5500ff00);

        // Border width of the circle
        circleOptions.strokeWidth(0);
        Circle circle = map.addCircle(circleOptions);

        // Add an overlay to the map, retaining a handle to the GroundOverlay object.
        //GroundOverlay imageOverlay = map.addGroundOverlay(newarkMap);


        GroundOverlayClass item = new GroundOverlayClass();
        //  item.setGroundOverlay(imageOverlay);
        item.setPollutionData(pollutionData);
        item.setCircle(circle);


        //add to groundOverlayList
        groundOverlayList.add(item);

    }

    /*
    updates the map depending on which sensors selected
     */
    public void updateMap(Integer itemClicked) {
        switch (itemClicked) {
            case 0:
                //all sensors
                
                break;
            case 1:
                //Temp sensor
                break;
            case 2:
                //Nitrogen  sensor
                break;
            case 3:
                //Oxygen  sensor
                break;
            case 4:
                //Argon sensor
                break;
            case 5:
                //dust sensor
                break;

            default:

        }

    }


    @Override
    public void onLocationChanged(Location location) {
        lat = (double) (location.getLatitude());
        lng = (double) (location.getLongitude());
        this.location = location;

    }

    @Override
    public void onStatusChanged(String provider, int status, Bundle extras) {

    }

    @Override
    public void onProviderEnabled(String provider) {

    }

    @Override
    public void onProviderDisabled(String provider) {

    }

    @Override
    protected void onStart() {
        super.onStart();
    }

    @Override
    protected void onResume() {
        super.onResume();
        locationManager.requestLocationUpdates(provider, 400, 1, this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        locationManager.removeUpdates(this);

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}