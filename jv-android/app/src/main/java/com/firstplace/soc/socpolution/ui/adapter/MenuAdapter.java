package com.firstplace.soc.socpolution.ui.adapter;

import android.app.Activity;
import android.content.Context;
import android.graphics.Color;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.TextView;

import com.firstplace.soc.socpolution.R;

import java.util.ArrayList;

/**
 * Created by petar_000 on 4/18/2015.
 */
public class MenuAdapter extends ArrayAdapter<NavDrawerItem>
{
    private final static String TAG=MenuAdapter.class.getSimpleName();
    private final Context context;
    private final int layoutResourceId;
    private ArrayList<NavDrawerItem> data= null;

    public MenuAdapter(Context context, int layoutResourceId, ArrayList<NavDrawerItem> data)
    {
        super(context, layoutResourceId, data);
        this.context = context;
        this.layoutResourceId = layoutResourceId;
        this.data = data;

    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent)
    {

        LayoutInflater inflater = ((Activity) context).getLayoutInflater();

        View v = inflater.inflate(layoutResourceId, parent, false);


        TextView textView = (TextView) v.findViewById(R.id.navDrawerTextView);

        NavDrawerItem choice = data.get(position);

        textView.setText(choice.name);

      if(data.get(position).selected==true ){
          v.setBackgroundColor(Color.GRAY);
          Log.d(TAG,"selected");
      }else{
          v.setBackgroundColor(Color.LTGRAY);
          Log.d(TAG,"unselected");
      }
        return v;
    }

    @Override
    public NavDrawerItem getItem(int position) {
        return data.get(position);
    }

    @Override
    public int getCount() {
        return data.size();
    }
}