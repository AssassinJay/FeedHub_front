<template>

  <div class="flex justify-center items-center" style="height: 100vh">
    <div class="row base-card-shadow" style="width: 60vw;min-width: 300px">
      <div class="col-6 flex justify-center items-center " v-show="true">
        <q-skeleton type="text" height="70%" width="50%" v-if="!isLottieF"/>
        <lottie-web-cimo align="right" style="height: 70%" :path="defaultOptions.path" @isLottieFinish="handleFinish"/>
      </div>
      <q-separator vertical inset v-if="$q.screen.gt.sm"/>
      <div class="col flex justify-center items-center">
        <q-card square style="min-width: 290px;height: 100%; width: 60%;" class="no-shadow">
          <q-card-section align="center">
            <h3 class="text-uppercase">SIGNUP</h3>
            <!-- 用户名 -->
            <q-input class="logon-input"
                     clearable
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="username"
                     label="账号"
            >
              <template v-slot:prepend>
                <q-icon name="account_circle"/>
              </template>
            </q-input>
<!--            昵称-->
            <q-input class="logon-input"
                     clearable
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="nickname"
                     label="昵称"
            >
              <template v-slot:prepend>
                <q-icon name="emoji_emotions"/>
              </template>
            </q-input>
            <!-- 密码 -->
            <q-input class="logon-input"
                     standout="bg-cyan text-white"
                     bottom-slots
                     v-model="password"
                     label="密码"
                     :type="isPwd ? 'password' : 'text'" hint=""
            >
              <template v-slot:prepend>
                <q-icon name="vpn_key"/>
              </template>
              <template v-slot:append>
                <q-icon
                  :name="isPwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwd = !isPwd"
                />
              </template>
            </q-input>
            <div class="row justify-between" style="margin-bottom: 20px;">
              <q-btn flat label="返回登录" @click="gotoLogin"/>
              <q-btn color="primary" label= "申请注册" @click="handleSignup"/>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>

</template>

<script>
/* eslint-disable */
import LottieWebCimo from '../../components/LottieWebCimo/lottie-web-cimo'

export default {
  name: 'signup',
  data () {
    return {
      isPwd: true,
      username: '',
      password: '',
      nickname: '',
      loading: false,
      percentage: 0,
      isLottieF: true,
      defaultOptions: {
        path: 'https://assets9.lottiefiles.com/packages/lf20_vo0a1yca.json',
        loop: true
      }
    }
  },
  components: { LottieWebCimo },
  methods: {
    handleSignup () {
      var query = {
        url:"/account/signup",
        params:{
          username:this.username,
          nickname:this.nickname,
          password:this.password
        }
      }
      this.$fetchData(query).then(res=>{
        if(res.data.error_code===0){
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '注册成功!',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
          this.gotoLogin()
        }

      })
    },
    gotoLogin () {
      this.$router.push('/login')
    },
    handleFinish (e) {
      this.isLottieF = e
    }
  }
}
</script>

<style scoped>
  .logon-btn {
    font-size: large;
    margin-top: 0px;
    margin-bottom: 20px;
    width: 100%;
  }

  .bg-logon-card-input {
    background: linear-gradient(to right, #36d1dc 1%, #5b86e5 99%);
    transition: all 0.3s ease-in-out;
    background-size: 200% auto;
  }

  .bg-logon-card-input:hover {
    background-position: right center;
    box-shadow: 0 12px 20px -11px #5b86e5;
  }
</style>
