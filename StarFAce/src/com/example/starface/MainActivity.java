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
import android.view.MotionEvent;
import android.view.View;
import android.view.View.OnTouchListener;
import android.widget.Button;

public class MainActivity extends Activity implements SensorEventListener {

	private SensorManager senSensorManager;
	private Sensor senAccelerometer;
	private long lastUpdate = 0;
	private SocketIO socket;
	private Button btnTras, btnFrente;
	private boolean BTN_TRAS = false, BTN_FRENTE = false;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_main);

		setUi();
		setSensors();
		setSocketIo();
	}

	private void setUi() {
		btnFrente = (Button) findViewById(R.id.btnFrente);
		btnFrente.setOnTouchListener(new OnTouchListener() {

			@Override
			public boolean onTouch(View v, MotionEvent event) {
				switch (event.getAction()) {
				case MotionEvent.ACTION_DOWN:
					BTN_FRENTE = true;
					break;

				case MotionEvent.ACTION_UP:
					BTN_FRENTE = false;
					break;
				}

				return true;
			}
		});

		btnTras = (Button) findViewById(R.id.btnTras);
		btnTras.setOnTouchListener(new OnTouchListener() {

			@Override
			public boolean onTouch(View v, MotionEvent event) {
				switch (event.getAction()) {
				case MotionEvent.ACTION_DOWN:
					BTN_TRAS = true;
					break;

				case MotionEvent.ACTION_UP:
					BTN_TRAS = false;
					break;
				}

				return true;
			}
		});
	}

	private void setSensors() {
		senSensorManager = (SensorManager) getSystemService(Context.SENSOR_SERVICE);
		senAccelerometer = senSensorManager
				.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
		senSensorManager.registerListener(this, senAccelerometer,
				SensorManager.SENSOR_DELAY_NORMAL);

	}

	private void setSocketIo() {
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
		JSONObject sensorData = new JSONObject();
		float x, y, z;
		long curTime = System.currentTimeMillis();

		if ((curTime - lastUpdate) > 200) {

			lastUpdate = curTime;

			if (mySensor.getType() == Sensor.TYPE_ACCELEROMETER) {
				x = event.values[0];
				y = event.values[1];
				z = event.values[2];

				try {
					sensorData
							.put("aceX", x)
							.put("aceY", y)
							.put("aceZ", z)
							.put("btnTras", BTN_TRAS)
							.put("btnFrente", BTN_FRENTE);
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}

			socket.emit("accelerometer", sensorData);
			Log.v("dsauihdsa", sensorData.toString());
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
