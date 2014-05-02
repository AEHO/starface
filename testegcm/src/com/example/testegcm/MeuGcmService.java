package com.example.testegcm;

import android.app.IntentService;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

public class MeuGcmService extends IntentService {
	private static final String TAG = "MeuGcmService";

	public MeuGcmService() {
		super("MeuGcmService");
	}

	@Override
	protected void onHandleIntent(Intent intent) {
		Bundle extras = intent.getExtras();
		// processaMensagem(extras);
		
		if (extras.containsKey("message")) {			
			Log.v(TAG, extras.getString("message"));
		} else {
			Log.v(TAG, "no message :(");
		}

		MeuGcmBroadcastReceiver.completeWakefulIntent(intent);
	}
}
