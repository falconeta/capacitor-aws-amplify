package com.capacitor.aws.amplify;

import android.os.Build;

import androidx.annotation.RequiresApi;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AwsAmplify")
public class AwsAmplifyPlugin extends Plugin {

    private AwsAmplify implementation = new AwsAmplify();

    @RequiresApi(api = Build.VERSION_CODES.N)
    @PluginMethod
    public void load(PluginCall call) {
      var cognitoConfig = call.getObject("cognitoConfig");

        implementation.load(
          cognitoConfig,
          bridge.getContext(),
          result ->  call.resolve(),
          error -> {
            call.reject(error.toString());
          });
    }

  @RequiresApi(api = Build.VERSION_CODES.N)
  @PluginMethod
  public void signOut(PluginCall call) {

    implementation.signOut(
      result ->  call.resolve(),
      error -> {
        call.reject(error.toString());
      });
  }

  @RequiresApi(api = Build.VERSION_CODES.N)
  @PluginMethod
  public void federatedSignIn(PluginCall call) {
    String provider = call.getString("provider");

    implementation.federatedSignIn(
      provider,
      this.getActivity(),
      result -> call.resolve(),
      error -> {
        call.reject(error.toString());
      });
//      onSuccess: { data in
//      self.implementation.fetchAuthSession(
//        onSuccess: {session in
//        call.resolve(session)
//      },
//      onError: {error in
//        call.reject(error.localizedDescription)
//      })

//    onError: { error in
//      print(error)
//      call.reject(error.localizedDescription)
//    })
  }
}
