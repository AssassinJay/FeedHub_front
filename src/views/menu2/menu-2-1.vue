<template>
    <base-content>
      <template>
        <div style="display: flex;justify-content: center;margin-top: 30px">
          <div class="q-pa-md" style="max-width: 1200px;min-width: 800px;">
            <q-list bordered class="rounded-borders" style="max-width: 600px">
              <q-item-label header>订阅管理</q-item-label>

              <q-item v-for="(item,index) in subList" :key="item.id">
                <q-item-section avatar top>
                  <q-icon name="rss_feed" color="black" size="34px" />
                </q-item-section>

                <q-item-section top class="col-2 gt-sm" style="">
                  <q-item-label class="q-mt-sm">{{item.feedName}}</q-item-label>
                </q-item-section>

                <q-item-section top>
                  <q-item-label lines="1">
                    <span class="text-weight-medium">{{item.feedUrl}}</span>
                  </q-item-label>
                  <q-item-label lines="1" class="q-mt-xs text-body2 text-weight-bold text-primary text-uppercase">
                    <q-toggle color="green" v-model="item.switcher" val="picture" @input="changeStatus(item)"/>
                  </q-item-label>
                </q-item-section>

                <q-item-section top side>
                  <div class="text-grey-8 q-gutter-xs">
                    <q-btn class="gt-xs" size="12px" flat dense round icon="delete_forever" @click="removeSub(item,index)"/>
                  </div>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
      </template>
    </base-content>
</template>

<script>
/* eslint-disable */
import BaseContent from '../../components/BaseContent/BaseContent'
export default {
  name: 'menu-2',
  components: { BaseContent },
  data () {
    return {
      notif2: true,
      subList:[]
    }
  },
  methods:{
    getAllSubs(){
      var query = {
        url: '/feed/getSubs'
      }
      this.$fetchData(query).then(res => {
        if (res.data.error_code === 0) {
          this.subList = res.data.data.Subscriptions
          for(let i=0;i<this.subList.length;i++){
            this.subList[i].switcher = this.subList[i].switcher===1?true:false;
          }
        }
      })
    },
    changeStatus(item){
      var query = {
        url: '/feed/subToggler',
        params: {
          toStatus:item.switcher,
          feed_id:item.id
        }
      }
      this.$fetchData(query).then(res => {
        if (res.data.error_code === 0) {
          if(item.switcher===false){
            this.$q.notify({
              icon: 'insert_emoticon',
              message: '屏蔽成功！',
              color: 'green',
              position: 'top',
              timeout: 1500
            })
          }else{
            this.$q.notify({
              icon: 'insert_emoticon',
              message: '解除屏蔽成功！',
              color: 'green',
              position: 'top',
              timeout: 1500
            })
          }
        }
      })
    },
    removeSub(item,index){
      var query = {
        url: '/feed/deleteSub',
        params: {
          feed_id:item.id
        }
      }
      this.$fetchData(query).then(res => {
        if (res.data.error_code === 0) {
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '取订成功！',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
          this.subList.splice(index,1);
        }
      })
    }
  },
  created() {
    this.getAllSubs()
  }
}
</script>
