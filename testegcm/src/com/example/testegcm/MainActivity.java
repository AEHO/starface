package com.example.testegcm;

import java.io.IOException;
import java.util.HashMap;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences.Editor;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.view.Menu;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.GooglePlayServicesUtil;
import com.google.android.gms.gcm.GoogleCloudMessaging;

/**
 * Atividade principal do Aplicativo. Ira fazer os testes de presenca do Google
 * Play Services. Se tudo ocorrer bem entao todos os processos estarao verdes e
 * o aparelho estara entao pronto para receber notificacoes
 */
public class MainActivity extends Activity {

	private static final String TAG = "MainActivity";
	private final static String GCM_TESTING_URL = "https://apresentae.appspot.com/gcm_testing/registro";
	private static final String SENDER_ID = "521054273906";
	private final static int PLAY_SERVICES_RESOLUTION_REQUEST = 9000;
	public final static String PROPERTY_REG_ID = "registration_id";
	private final static String PROPERTY_APP_VERSION = "appVersion";

	private Context mContext;
	private String mCodigo = "32433424";
	GoogleCloudMessaging mGcm;
	SharedPrefsHelper mPrefsHelper;
	String mRegid;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.activity_main);
		mContext = getApplicationContext();

		if (checkPlayServices()) {
			mPrefsHelper = new SharedPrefsHelper(mContext);
			mGcm = GoogleCloudMessaging.getInstance(this);
			mRegid = getRegistrationId(mContext);
			if (mRegid.equals("")) {
				registerInBackground(mContext);
			} else {
				Log.v(TAG, "JÁ FOI REGISTRADO!");
			}
		} else {
			Log.v(TAG, "Play Services is NOT OK!");
		}
	}

	@Override
	public boolean onCreateOptionsMenu(Menu menu) {
		getMenuInflater().inflate(R.menu.main, menu);
		return true;
	}

	@Override
	protected void onResume() {
		super.onResume();
		if (checkPlayServices()) {
			Log.v(TAG, "Play Services is OK!");
		} else {
			Log.v(TAG, "Play Services is NOT OK!");
		}
	}

	/**
	 * Verifica se o cliente possui o Google Play Services instalado. Caso
	 * contrário irá emitir um dialog padrão para que o usuário baixe.
	 * 
	 * @return true -- possui
	 * @return false -- nao foi possivel obter
	 */
	private boolean checkPlayServices() {
		int resultCode = GooglePlayServicesUtil
				.isGooglePlayServicesAvailable(this);
		if (resultCode != ConnectionResult.SUCCESS) {
			if (GooglePlayServicesUtil.isUserRecoverableError(resultCode)) {
				GooglePlayServicesUtil.getErrorDialog(resultCode, this,
						PLAY_SERVICES_RESOLUTION_REQUEST).show();
			} else {
				Log.i(TAG, "This device is not supported.");
				finish();
			}
			return false;
		}
		return true;
	}

	private int getAppVersion() {
		try {
			PackageInfo packageInfo = mContext.getPackageManager()
					.getPackageInfo(mContext.getPackageName(), 0);
			return packageInfo.versionCode;
		} catch (NameNotFoundException e) {
			throw new RuntimeException(
					"Nao foi possivel obter o nome de pacote: " + e);
		}
	}

	/**
	 * Guarda o codigo de registro do aparelho no SharedPreferences para nao ser
	 * preciso gera-lo toda vez que a atividade rodar.
	 * 
	 * @param mContext
	 *            Contexto da aplicacao
	 * @param registration_id
	 *            'mRegid' para guardar
	 */
	private void storeRegistrationId(Context mContext, String registration_id) {
		int app_version = getAppVersion();
		Editor editor = mPrefsHelper.getEditor();
		editor.putString(PROPERTY_REG_ID, registration_id);
		editor.putInt(PROPERTY_APP_VERSION, app_version);
		editor.commit();
	}

	/**
	 * Obtem o Nome do aparelho junto a seu fabricante
	 * 
	 * @return exemplo: SAMSUNG I9300GT
	 */
	public String getDeviceName() {
		String manufacturer = Build.MANUFACTURER.toUpperCase();
		String model = Build.MODEL.toUpperCase();
		if (model.startsWith(manufacturer)) {
			return model;
		} else {
			return manufacturer + " " + model;
		}
	}

	/**
	 * Executa um POST para o webservice para o registro temporario do aparelho
	 * para que possamos enviar a ele a notificacao.
	 * 
	 * @param registration_id
	 * @return True -- conseguiu
	 * @return False -- falhou
	 */
	private boolean sendRegistrationToBackend(String registration_id) {
		HashMap<String, String> data = new HashMap<String, String>();
		data.put("codigo", mCodigo);
		data.put("regid", registration_id);
		data.put("modelo", getDeviceName());
		PostData pd = new PostData(GCM_TESTING_URL, data);
		try {
			String response = pd.sendData();
			if (!response.equals("") && !response.equals("error")) {
				return true;
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return false;
	}

	/**
	 * Prepara e executa o envio do registro para o backend. Se correto, salva o
	 * codigo de registro, caso contrario, nao.
	 * 
	 * @param mContext
	 *            mContexto da aplicacao
	 */
	public void registerInBackground(final Context mContext) {
		new AsyncTask<Void, Void, String>() {

			boolean status_registro;

			@Override
			protected String doInBackground(Void... params) {
				String msg = "";
				try {
					if (mGcm == null) {
						mGcm = GoogleCloudMessaging.getInstance(mContext);
					}
					mRegid = mGcm.register(SENDER_ID);
					msg = "Device registrado, registration_id = " + mRegid;
					if (sendRegistrationToBackend(mRegid)) {
						storeRegistrationId(mContext, mRegid);
						status_registro = true;
					} else {
						status_registro = false;
					}
				} catch (IOException ex) {
					msg = "Error: " + ex.getMessage();
				}
				return null;
			}

			@Override
			protected void onPostExecute(String result) {
				super.onPostExecute(result);
				if (status_registro) {
					Log.v(TAG, "REGISTRO FEITO COM SUCESSO");
					// marcaItem(tvRegInBack, true);
					// marcaItem(tvReadyReceive, true);
				} else {
					Log.v(TAG, "REGISTRO FALHOU");
					// marcaItem(tvRegInBack, false);
					// marcaItem(tvReadyReceive, false);
				}
				// pbBar.setVisibility(View.GONE);
			}

		}.execute();
	}

	/**
	 * Obtem o codigo de registro do GCM guardado
	 * 
	 * @param mContext
	 * @return registration_id ou ""
	 */
	public String getRegistrationId(Context mContext) {
		String registration_id = mPrefsHelper.getStringFromKey(PROPERTY_REG_ID);
		if (registration_id.equals("")) {
			return "";
		}
		int registeredVersion = mPrefsHelper
				.getIntFromKey(PROPERTY_APP_VERSION);
		int currentVersion = getCurrentAppVersion(mContext);
		if (registeredVersion != currentVersion) {
			return "";
		}
		return registration_id;
	}

	/**
	 * Obtem a versao atual do aplicativo. Necessario para enviar diferentes
	 * tipos de mensagens dependendo da versao do aplicativo do cliente
	 * 
	 * @param mContext
	 * @return Versao do aplicativo
	 */
	public int getCurrentAppVersion(Context mContext) {
		try {
			PackageInfo packageInfo = mContext.getPackageManager()
					.getPackageInfo(mContext.getPackageName(), 0);
			return packageInfo.versionCode;
		} catch (NameNotFoundException e) {
			// rarely happens (should not happen)
			throw new RuntimeException("Could not get package name: " + e);
		}
	}

}
