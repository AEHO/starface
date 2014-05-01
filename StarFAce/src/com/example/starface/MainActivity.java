package com.example.starface;

import io.socket.IOAcknowledge;
import io.socket.IOCallback;
import io.socket.SocketIO;
import io.socket.SocketIOException;

import java.net.MalformedURLException;

import org.json.JSONException;
import org.json.JSONObject;

import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;
import android.view.MenuItem;

public class MainActivity extends Activity implements SensorEventListener {

	private SensorManager senSensorManager;
	private Sensor senAccelerometer;
	private long lastUpdate = 0;
	private float last_x, last_y, last_z;
	private SocketIO socket;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_main);

		senSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
		senAccelerometer = senSensorManager
				.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
		senSensorManager.registerListener(this, senAccelerometer,
				SensorManager.SENSOR_DELAY_NORMAL);

		try {
			socket = new SocketIO("http://192.168.1.13:3000");
			socket.connect(new IOCallback() {

				@Override
				public void on(String event, IOAcknowledge ack, Object... args) {
				}

				@Override
				public void onConnect() {
					Log.v("SOCKETIO", "Connection Event Fired");
				}

				@Override
				public void onDisconnect() {
				}

				@Override
				public void onError(SocketIOException socketIOException) {
				}

				@Override
				public void onMessage(String data, IOAcknowledge ack) {

				}

				@Override
				public void onMessage(JSONObject data, IOAcknowledge ack) {

				}
			});

		} catch (MalformedURLException e) {
			e.printStackTrace();
		}

	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	public void onAccuracyChanged(Sensor sensor, int accuracy) {

	}

	@Override
	public void onSensorChanged(SensorEvent event) {
		Sensor mySensor = event.sensor;

		if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {
			float x = event.values[0];
			float y = event.values[1];
			float z = event.values[2];

			long curTime = System.currentTimeMillis();

			if ((curTime - lastUpdate) > 500) {
				long diffTime = (curTime - lastUpdate);
				lastUpdate = curTime;

				float speed = Math.abs(x + y + z - last_x - last_y - last_z)
						/ diffTime * 10000;

				try {
					socket.emit(
							"my other event",
							new JSONObject().put("posX", x).put("posY", y)
									.put("posZ", z));
				} catch (JSONException e) {
					e.printStackTrace();
				}

				// Log.v("MainActivity", "x: " + Float.toString(x) + " -- y: "
				// + Float.toString(y) + " -- z: " + Float.toString(z));
			}
		}
	}

	protected void onPause() {
		super.onPause();
		senSensorManager.unregisterListener(this);
	}

	protected void onResume() {
		super.onResume();
		senSensorManager.registerListener(this, senAccelerometer,
				SensorManager.SENSOR_DELAY_NORMAL);
	}

	@Override
	public boolean onOptionsItemSelected(MenuItem item) {
		switch (item.getItemId()) {
		case R.id.m_calibrate:
			Log.v("MainActivity", "CALIBRAR!");
			return true;
		default:
			return super.onOptionsItemSelected(item);
		}
	}

}
