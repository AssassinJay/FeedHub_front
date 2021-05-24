<template>
  <base-content>
    <template>
      <div class="q-pa-md" style="display: flex;justify-content: center;margin-top: 50px">
        <div class="q-gutter-y-md" style="max-width: 400px">
          <q-tabs
            v-model="tab"
            narrow-indicator
            dense
            align="justify"
            class="text-primary"
          >
            <q-tab :ripple="false" name="add" icon="rss_feed" label="Add" />
            <q-tab :ripple="false" name="market" icon="apps" label="Market" />
            <q-tab :ripple="false" name="classify" icon="category" label="Classify" />
          </q-tabs>
        </div>
      </div>
    </template>
    <div style="display: flex;justify-content: center" v-if="tab==='add'">
      <div style="width: 800px">
        <p style="font-size: 22px;color: #9e9e9e;float: left;margin-right: 20px">Add Feed by inputing RSS link directly. </p>
        <q-btn flat style="color: #f5712c" label="RSSHub doc" @click="gotoDoc"/>
        <q-input color="teal" outlined v-model="RSSLink" label="RSS Link" style="clear: both;">
          <template v-slot:append>
            <q-avatar icon="rss_feed">
            </q-avatar>
          </template>
        </q-input>
        <div class="q-gutter-sm" style="margin-top: 10px">
          <div style="font-size:22px;float: left;color: #9e9e9e">Is this feed from RSSHub?</div>
          <q-radio v-model="isFromRSSHub" val="true" label="True" />
          <q-radio v-model="isFromRSSHub" val="false" label="False" />
        </div>
        <div class="q-gutter-sm" style="max-width: 300px;margin-top: 10px;display: flex;justify-content: left">
          <q-input outlined v-model="channelName" label="Channel" />
          <q-input outlined v-model="feedName" label="Name of Feed" />
        </div>
        <div class="q-gutter-sm" style="max-width: 300px;margin-top: 10px;clear: both;">
          <q-select outlined v-model="type_id" :options="options" label="TYPE" />
        </div>
        <div class="q-gutter-sm"  style="max-width: 300px;margin-top: 10px">
          <q-btn color="secondary" icon-right="send" label="SUBMIT" @click="handleSubmit"/>
        </div>
      </div>
    </div>
    <div style="display: flex;justify-content: center" v-if="tab==='market'">
      <div style="width: 800px">
        <p style="font-size: 22px;color: #9e9e9e;float: left;margin-right: 20px">Discover the best sources for any topic. </p>
        <q-input color="teal" outlined v-model="topic_content" label="search by topic or key words" style="clear: both;width: 800px;" counter >
          <template v-slot:after>
            <q-btn round dense flat icon="send" />
          </template>
          <template v-slot:append>
            <q-icon name="close" @click="topic_content = ''" class="cursor-pointer" />
          </template>
        </q-input>

        <template v-if="topic_content===''">
          <div class="q-pa-md row items-start q-gutter-md" style="width: 1000px;">
            <q-card class="my-card" flat bordered v-for="item in channelTypeList" :key="item.value" style="width: 180px;cursor: pointer" @click="getFeedListByTopic(item)">
              <q-card-section horizontal>
                <q-card-section class="q-pt-xs">
                  <div class="text-overline">Topic</div>
                  <div class="text-h5 q-mt-sm q-mb-xs">#{{item.label}}</div>
                  <div class="text-caption text-grey">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                  </div>
                </q-card-section>
              </q-card-section>
            </q-card>
          </div>
        </template>
        <template>
          <q-card class="my-card" flat bordered style="margin-top: 10px;width: 600px;" v-for="item in feedList" :key="item.id">
            <q-card-section horizontal>
              <q-card-section class="q-pt-xs">
                <div class="text-overline">RSS Feed - {{item.souce_name}}</div>
                <div class="text-h5 q-mt-sm q-mb-xs">{{item.feed_name}}</div>
                <div class="text-caption text-grey">
                  {{item.feed_url}}
                </div>
              </q-card-section>

<!--              <q-card-section class="col-5">-->
<!--                <div style="float: right;">-->
<!--                  <img-->
<!--                    src="../../assets/baseline_rss_feed_black_48dp.png"-->
<!--                  />-->
<!--                </div>-->
<!--              </q-card-section>-->
            </q-card-section>

            <q-separator />

            <q-card-actions>
              <q-btn flat color="primary" v-if="subIdList.indexOf(item.id)<=-1" @click="handleSubscibe(item.id)">
                Subscribe
              </q-btn>
              <q-btn flat style="color: #FF0080" v-else disable>
                Subscribed
              </q-btn>
            </q-card-actions>
          </q-card>
        </template>
      </div>

    </div>
  </base-content>
</template>

<script>
/* eslint-disable */
import BaseContent from '../../components/BaseContent/BaseContent'
export default {
  name: 'menu3-1-1',
  components: { BaseContent },
  data () {
    return {
      tab: 'add',
      splitterModel: 20,
      RSSLink:"",
      isFromRSSHub:"true",
      RSSHubDocLink:"https://docs.rsshub.app/",
      channelName:"",
      options: [],
      type_id:"",
      feedName:"",
      channelTypeList:[],
      topic_content:"",
      feedList:[],
      subIdList:[]
    }
  },
  methods:{
    handleSubscibe(id){
      var query = {
        url:"/feed/addSubscribe",
        params:{
          feed_id:id
        }
      }
      this.$fetchData(query).then(res=>{
        if(res.data.error_code===0){
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '订阅成功！',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
          this.subIdList.push(id)
        }
      })
    },
    getFeedListByTopic(item){
      this.topic_content = "#" + item.label;
      var query = {
        url: '/feed/getFeedList',
        params:{
          type_id:item.value
        }
      }
      this.$fetchData(query).then( res => {
        if(res.data.error_code===0){
          this.feedList = res.data.data.feedList
        }
      })
    },
    gotoDoc(){
      window.open(this.RSSHubDocLink)
    },
    getSourceType(){
      var query = {
        url: '/feed/getChannelType'
      }
      this.$fetchData(query).then( res => {
        for(let i=0;i<res.data.data.SourceTypeList.length;i++){
          var temp = {
            label:res.data.data.SourceTypeList[i].typeName,
            value:res.data.data.SourceTypeList[i].id
          }
          this.options.push(temp)
        }
        this.channelTypeList = this.options
      })
    },
    handleSubmit(){
      if(this.RSSLink===""||this.feedName===""||this.channelName===""||this.type_id.value==="") {
        this.$q.notify({
          icon: 'insert_emoticon',
          message: '请填写完整！',
          color: 'red',
          position: 'top',
          timeout: 1500
        })
        return;
      }
      var query = {
        url:"/feed/addFeed",
        params:{
          feed_url:this.RSSLink,
          feed_name:this.feedName,
          channel_name:this.channelName,
          type_id:this.type_id.value,
          isFromRSSHub: this.isFromRSSHub
        }
      }
      this.$fetchData(query).then(res=>{
        if(res.data.error_code===0){
          this.$q.notify({
            icon: 'insert_emoticon',
            message: '添加订阅成功！',
            color: 'green',
            position: 'top',
            timeout: 1500
          })
        }
      })
    },
    getSubidList(){
      var query = {
        url:"/feed/getSubidList"
      }
      this.$fetchData(query).then(res=>{
        this.subIdList = res.data.data.SubidList
      })
    }
  },
  created() {
    this.getSourceType()
    this.getSubidList()
  }
}
</script>
