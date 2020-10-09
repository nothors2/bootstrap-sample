<li> 
<div class="" @click="isOpen = !isOpen">{{item.text}} 
  <span >[{{ isOpen ? '-' : '+' }}]</span>
</div>
<!-- <div v-for="(child) in item.child" v-if="child"class="item"   >div1 :{{child.text}} 
  <div v-for="(child2) in child.child" v-if="child2"class="item"  > &nbsp;div2 :{{child2.text}} 
      <div v-for="(child3) in child2.child" v-if="child3"class="item"   > &nbsp;&nbsp;div3 :{{child3}}</div>
  </div>  
</div>   -->
<ul v-show="isOpen">
    <my-component v-for="(child) in item.child" v-if="child" class="item" :item="child" > 
    </my-component>
</ul>
</li >