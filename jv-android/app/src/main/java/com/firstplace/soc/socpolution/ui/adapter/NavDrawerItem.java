package com.firstplace.soc.socpolution.ui.adapter;

/**
 * Created by petar_000 on 4/18/2015.
 */
public class NavDrawerItem
{
    public int icon;
    public String name;
    public Boolean selected;
    public NavDrawerItem(int icon, String name,Boolean selected)
    {
        this.icon = icon;
        this.name = name;
        this.selected=selected;
    }
}