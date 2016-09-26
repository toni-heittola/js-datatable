(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsyaml=f()}})(function(){var define,module,exports;return(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){'use strict';var loader=require('./js-yaml/loader');var dumper=require('./js-yaml/dumper');function deprecated(name){return function(){throw new Error('Function '+name+' is deprecated and cannot be used.');};}
module.exports.Type=require('./js-yaml/type');module.exports.Schema=require('./js-yaml/schema');module.exports.FAILSAFE_SCHEMA=require('./js-yaml/schema/failsafe');module.exports.JSON_SCHEMA=require('./js-yaml/schema/json');module.exports.CORE_SCHEMA=require('./js-yaml/schema/core');module.exports.DEFAULT_SAFE_SCHEMA=require('./js-yaml/schema/default_safe');module.exports.DEFAULT_FULL_SCHEMA=require('./js-yaml/schema/default_full');module.exports.load=loader.load;module.exports.loadAll=loader.loadAll;module.exports.safeLoad=loader.safeLoad;module.exports.safeLoadAll=loader.safeLoadAll;module.exports.dump=dumper.dump;module.exports.safeDump=dumper.safeDump;module.exports.YAMLException=require('./js-yaml/exception');module.exports.MINIMAL_SCHEMA=require('./js-yaml/schema/failsafe');module.exports.SAFE_SCHEMA=require('./js-yaml/schema/default_safe');module.exports.DEFAULT_SCHEMA=require('./js-yaml/schema/default_full');module.exports.scan=deprecated('scan');module.exports.parse=deprecated('parse');module.exports.compose=deprecated('compose');module.exports.addConstructor=deprecated('addConstructor');},{"./js-yaml/dumper":3,"./js-yaml/exception":4,"./js-yaml/loader":5,"./js-yaml/schema":7,"./js-yaml/schema/core":8,"./js-yaml/schema/default_full":9,"./js-yaml/schema/default_safe":10,"./js-yaml/schema/failsafe":11,"./js-yaml/schema/json":12,"./js-yaml/type":13}],2:[function(require,module,exports){'use strict';function isNothing(subject){return(typeof subject==='undefined')||(subject===null);}
function isObject(subject){return(typeof subject==='object')&&(subject!==null);}
function toArray(sequence){if(Array.isArray(sequence))return sequence;else if(isNothing(sequence))return[];return[sequence];}
function extend(target,source){var index,length,key,sourceKeys;if(source){sourceKeys=Object.keys(source);for(index=0,length=sourceKeys.length;index<length;index+=1){key=sourceKeys[index];target[key]=source[key];}}
return target;}
function repeat(string,count){var result='',cycle;for(cycle=0;cycle<count;cycle+=1){result+=string;}
return result;}
function isNegativeZero(number){return(number===0)&&(Number.NEGATIVE_INFINITY===1/number);}
module.exports.isNothing=isNothing;module.exports.isObject=isObject;module.exports.toArray=toArray;module.exports.repeat=repeat;module.exports.isNegativeZero=isNegativeZero;module.exports.extend=extend;},{}],3:[function(require,module,exports){'use strict';var common=require('./common');var YAMLException=require('./exception');var DEFAULT_FULL_SCHEMA=require('./schema/default_full');var DEFAULT_SAFE_SCHEMA=require('./schema/default_safe');var _toString=Object.prototype.toString;var _hasOwnProperty=Object.prototype.hasOwnProperty;var CHAR_TAB=0x09;var CHAR_LINE_FEED=0x0A;var CHAR_SPACE=0x20;var CHAR_EXCLAMATION=0x21;var CHAR_DOUBLE_QUOTE=0x22;var CHAR_SHARP=0x23;var CHAR_PERCENT=0x25;var CHAR_AMPERSAND=0x26;var CHAR_SINGLE_QUOTE=0x27;var CHAR_ASTERISK=0x2A;var CHAR_COMMA=0x2C;var CHAR_MINUS=0x2D;var CHAR_COLON=0x3A;var CHAR_GREATER_THAN=0x3E;var CHAR_QUESTION=0x3F;var CHAR_COMMERCIAL_AT=0x40;var CHAR_LEFT_SQUARE_BRACKET=0x5B;var CHAR_RIGHT_SQUARE_BRACKET=0x5D;var CHAR_GRAVE_ACCENT=0x60;var CHAR_LEFT_CURLY_BRACKET=0x7B;var CHAR_VERTICAL_LINE=0x7C;var CHAR_RIGHT_CURLY_BRACKET=0x7D;var ESCAPE_SEQUENCES={};ESCAPE_SEQUENCES[0x00]='\\0';ESCAPE_SEQUENCES[0x07]='\\a';ESCAPE_SEQUENCES[0x08]='\\b';ESCAPE_SEQUENCES[0x09]='\\t';ESCAPE_SEQUENCES[0x0A]='\\n';ESCAPE_SEQUENCES[0x0B]='\\v';ESCAPE_SEQUENCES[0x0C]='\\f';ESCAPE_SEQUENCES[0x0D]='\\r';ESCAPE_SEQUENCES[0x1B]='\\e';ESCAPE_SEQUENCES[0x22]='\\"';ESCAPE_SEQUENCES[0x5C]='\\\\';ESCAPE_SEQUENCES[0x85]='\\N';ESCAPE_SEQUENCES[0xA0]='\\_';ESCAPE_SEQUENCES[0x2028]='\\L';ESCAPE_SEQUENCES[0x2029]='\\P';var DEPRECATED_BOOLEANS_SYNTAX=['y','Y','yes','Yes','YES','on','On','ON','n','N','no','No','NO','off','Off','OFF'];function compileStyleMap(schema,map){var result,keys,index,length,tag,style,type;if(map===null)return{};result={};keys=Object.keys(map);for(index=0,length=keys.length;index<length;index+=1){tag=keys[index];style=String(map[tag]);if(tag.slice(0,2)==='!!'){tag='tag:yaml.org,2002:'+tag.slice(2);}
type=schema.compiledTypeMap[tag];if(type&&_hasOwnProperty.call(type.styleAliases,style)){style=type.styleAliases[style];}
result[tag]=style;}
return result;}
function encodeHex(character){var string,handle,length;string=character.toString(16).toUpperCase();if(character<=0xFF){handle='x';length=2;}else if(character<=0xFFFF){handle='u';length=4;}else if(character<=0xFFFFFFFF){handle='U';length=8;}else{throw new YAMLException('code point within a string may not be greater than 0xFFFFFFFF');}
return'\\'+handle+common.repeat('0',length-string.length)+string;}
function State(options){this.schema=options['schema']||DEFAULT_FULL_SCHEMA;this.indent=Math.max(1,(options['indent']||2));this.skipInvalid=options['skipInvalid']||false;this.flowLevel=(common.isNothing(options['flowLevel'])?-1:options['flowLevel']);this.styleMap=compileStyleMap(this.schema,options['styles']||null);this.sortKeys=options['sortKeys']||false;this.lineWidth=options['lineWidth']||80;this.noRefs=options['noRefs']||false;this.noCompatMode=options['noCompatMode']||false;this.implicitTypes=this.schema.compiledImplicit;this.explicitTypes=this.schema.compiledExplicit;this.tag=null;this.result='';this.duplicates=[];this.usedDuplicates=null;}
function indentString(string,spaces){var ind=common.repeat(' ',spaces),position=0,next=-1,result='',line,length=string.length;while(position<length){next=string.indexOf('\n',position);if(next===-1){line=string.slice(position);position=length;}else{line=string.slice(position,next+1);position=next+1;}
if(line.length&&line!=='\n')result+=ind;result+=line;}
return result;}
function generateNextLine(state,level){return'\n'+common.repeat(' ',state.indent*level);}
function testImplicitResolving(state,str){var index,length,type;for(index=0,length=state.implicitTypes.length;index<length;index+=1){type=state.implicitTypes[index];if(type.resolve(str)){return true;}}
return false;}
function isWhitespace(c){return c===CHAR_SPACE||c===CHAR_TAB;}
function isPrintable(c){return(0x00020<=c&&c<=0x00007E)||((0x000A1<=c&&c<=0x00D7FF)&&c!==0x2028&&c!==0x2029)||((0x0E000<=c&&c<=0x00FFFD)&&c!==0xFEFF )||(0x10000<=c&&c<=0x10FFFF);}
function isPlainSafe(c){return isPrintable(c)&&c!==0xFEFF
&&c!==CHAR_COMMA&&c!==CHAR_LEFT_SQUARE_BRACKET&&c!==CHAR_RIGHT_SQUARE_BRACKET&&c!==CHAR_LEFT_CURLY_BRACKET&&c!==CHAR_RIGHT_CURLY_BRACKET
&&c!==CHAR_COLON&&c!==CHAR_SHARP;}
function isPlainSafeFirst(c){return isPrintable(c)&&c!==0xFEFF&&!isWhitespace(c)
&&c!==CHAR_MINUS&&c!==CHAR_QUESTION&&c!==CHAR_COLON&&c!==CHAR_COMMA&&c!==CHAR_LEFT_SQUARE_BRACKET&&c!==CHAR_RIGHT_SQUARE_BRACKET&&c!==CHAR_LEFT_CURLY_BRACKET&&c!==CHAR_RIGHT_CURLY_BRACKET
&&c!==CHAR_SHARP&&c!==CHAR_AMPERSAND&&c!==CHAR_ASTERISK&&c!==CHAR_EXCLAMATION&&c!==CHAR_VERTICAL_LINE&&c!==CHAR_GREATER_THAN&&c!==CHAR_SINGLE_QUOTE&&c!==CHAR_DOUBLE_QUOTE
&&c!==CHAR_PERCENT&&c!==CHAR_COMMERCIAL_AT&&c!==CHAR_GRAVE_ACCENT;}
var STYLE_PLAIN=1,STYLE_SINGLE=2,STYLE_LITERAL=3,STYLE_FOLDED=4,STYLE_DOUBLE=5;function chooseScalarStyle(string,singleLineOnly,indentPerLevel,lineWidth,testAmbiguousType){var i;var char;var hasLineBreak=false;var hasFoldableLine=false;var shouldTrackWidth=lineWidth!==-1;var previousLineBreak=-1;var plain=isPlainSafeFirst(string.charCodeAt(0))&&!isWhitespace(string.charCodeAt(string.length-1));if(singleLineOnly){for(i=0;i<string.length;i++){char=string.charCodeAt(i);if(!isPrintable(char)){return STYLE_DOUBLE;}
plain=plain&&isPlainSafe(char);}}else{for(i=0;i<string.length;i++){char=string.charCodeAt(i);if(char===CHAR_LINE_FEED){hasLineBreak=true;if(shouldTrackWidth){hasFoldableLine=hasFoldableLine||(i-previousLineBreak-1>lineWidth&&string[previousLineBreak+1]!==' ');previousLineBreak=i;}}else if(!isPrintable(char)){return STYLE_DOUBLE;}
plain=plain&&isPlainSafe(char);}
hasFoldableLine=hasFoldableLine||(shouldTrackWidth&&(i-previousLineBreak-1>lineWidth&&string[previousLineBreak+1]!==' '));}
if(!hasLineBreak&&!hasFoldableLine){return plain&&!testAmbiguousType(string)?STYLE_PLAIN:STYLE_SINGLE;}
if(string[0]===' '&&indentPerLevel>9){return STYLE_DOUBLE;}
return hasFoldableLine?STYLE_FOLDED:STYLE_LITERAL;}
function writeScalar(state,string,level,iskey){state.dump=(function(){if(string.length===0){return"''";}
if(!state.noCompatMode&&DEPRECATED_BOOLEANS_SYNTAX.indexOf(string)!==-1){return"'"+string+"'";}
var indent=state.indent*Math.max(1,level);var lineWidth=state.lineWidth===-1?-1:Math.max(Math.min(state.lineWidth,40),state.lineWidth-indent);var singleLineOnly=iskey
||(state.flowLevel>-1&&level>=state.flowLevel);function testAmbiguity(string){return testImplicitResolving(state,string);}
switch(chooseScalarStyle(string,singleLineOnly,state.indent,lineWidth,testAmbiguity)){case STYLE_PLAIN:return string;case STYLE_SINGLE:return"'"+string.replace(/'/g,"''")+"'";case STYLE_LITERAL:return'|'+blockHeader(string,state.indent)
+dropEndingNewline(indentString(string,indent));case STYLE_FOLDED:return'>'+blockHeader(string,state.indent)
+dropEndingNewline(indentString(foldString(string,lineWidth),indent));case STYLE_DOUBLE:return'"'+escapeString(string,lineWidth)+'"';default:throw new YAMLException('impossible error: invalid scalar style');}}());}
function blockHeader(string,indentPerLevel){var indentIndicator=(string[0]===' ')?String(indentPerLevel):'';var clip=string[string.length-1]==='\n';var keep=clip&&(string[string.length-2]==='\n'||string==='\n');var chomp=keep?'+':(clip?'':'-');return indentIndicator+chomp+'\n';}
function dropEndingNewline(string){return string[string.length-1]==='\n'?string.slice(0,-1):string;}
function foldString(string,width){var lineRe=/(\n+)([^\n]*)/g;var result=(function(){var nextLF=string.indexOf('\n');nextLF=nextLF!==-1?nextLF:string.length;lineRe.lastIndex=nextLF;return foldLine(string.slice(0,nextLF),width);}());var prevMoreIndented=string[0]==='\n'||string[0]===' ';var moreIndented;var match;while((match=lineRe.exec(string))){var prefix=match[1],line=match[2];moreIndented=(line[0]===' ');result+=prefix
+(!prevMoreIndented&&!moreIndented&&line!==''?'\n':'')
+foldLine(line,width);prevMoreIndented=moreIndented;}
return result;}
function foldLine(line,width){if(line===''||line[0]===' ')return line;var breakRe=/ [^ ]/g;var match;var start=0,end,curr=0,next=0;var result='';while((match=breakRe.exec(line))){next=match.index;if(next-start>width){end=(curr>start)?curr:next;result+='\n'+line.slice(start,end);start=end+1;}
curr=next;}
result+='\n';if(line.length-start>width&&curr>start){result+=line.slice(start,curr)+'\n'+line.slice(curr+1);}else{result+=line.slice(start);}
return result.slice(1);}
function escapeString(string){var result='';var char;var escapeSeq;for(var i=0;i<string.length;i++){char=string.charCodeAt(i);escapeSeq=ESCAPE_SEQUENCES[char];result+=!escapeSeq&&isPrintable(char)?string[i]:escapeSeq||encodeHex(char);}
return result;}
function writeFlowSequence(state,level,object){var _result='',_tag=state.tag,index,length;for(index=0,length=object.length;index<length;index+=1){if(writeNode(state,level,object[index],false,false)){if(index!==0)_result+=', ';_result+=state.dump;}}
state.tag=_tag;state.dump='['+_result+']';}
function writeBlockSequence(state,level,object,compact){var _result='',_tag=state.tag,index,length;for(index=0,length=object.length;index<length;index+=1){if(writeNode(state,level+1,object[index],true,true)){if(!compact||index!==0){_result+=generateNextLine(state,level);}
_result+='- '+state.dump;}}
state.tag=_tag;state.dump=_result||'[]';}
function writeFlowMapping(state,level,object){var _result='',_tag=state.tag,objectKeyList=Object.keys(object),index,length,objectKey,objectValue,pairBuffer;for(index=0,length=objectKeyList.length;index<length;index+=1){pairBuffer='';if(index!==0)pairBuffer+=', ';objectKey=objectKeyList[index];objectValue=object[objectKey];if(!writeNode(state,level,objectKey,false,false)){continue;}
if(state.dump.length>1024)pairBuffer+='? ';pairBuffer+=state.dump+': ';if(!writeNode(state,level,objectValue,false,false)){continue;}
pairBuffer+=state.dump;_result+=pairBuffer;}
state.tag=_tag;state.dump='{'+_result+'}';}
function writeBlockMapping(state,level,object,compact){var _result='',_tag=state.tag,objectKeyList=Object.keys(object),index,length,objectKey,objectValue,explicitPair,pairBuffer;if(state.sortKeys===true){objectKeyList.sort();}else if(typeof state.sortKeys==='function'){objectKeyList.sort(state.sortKeys);}else if(state.sortKeys){throw new YAMLException('sortKeys must be a boolean or a function');}
for(index=0,length=objectKeyList.length;index<length;index+=1){pairBuffer='';if(!compact||index!==0){pairBuffer+=generateNextLine(state,level);}
objectKey=objectKeyList[index];objectValue=object[objectKey];if(!writeNode(state,level+1,objectKey,true,true,true)){continue;}
explicitPair=(state.tag!==null&&state.tag!=='?')||(state.dump&&state.dump.length>1024);if(explicitPair){if(state.dump&&CHAR_LINE_FEED===state.dump.charCodeAt(0)){pairBuffer+='?';}else{pairBuffer+='? ';}}
pairBuffer+=state.dump;if(explicitPair){pairBuffer+=generateNextLine(state,level);}
if(!writeNode(state,level+1,objectValue,true,explicitPair)){continue;}
if(state.dump&&CHAR_LINE_FEED===state.dump.charCodeAt(0)){pairBuffer+=':';}else{pairBuffer+=': ';}
pairBuffer+=state.dump;_result+=pairBuffer;}
state.tag=_tag;state.dump=_result||'{}';}
function detectType(state,object,explicit){var _result,typeList,index,length,type,style;typeList=explicit?state.explicitTypes:state.implicitTypes;for(index=0,length=typeList.length;index<length;index+=1){type=typeList[index];if((type.instanceOf||type.predicate)&&(!type.instanceOf||((typeof object==='object')&&(object instanceof type.instanceOf)))&&(!type.predicate||type.predicate(object))){state.tag=explicit?type.tag:'?';if(type.represent){style=state.styleMap[type.tag]||type.defaultStyle;if(_toString.call(type.represent)==='[object Function]'){_result=type.represent(object,style);}else if(_hasOwnProperty.call(type.represent,style)){_result=type.represent[style](object,style);}else{throw new YAMLException('!<'+type.tag+'> tag resolver accepts not "'+style+'" style');}
state.dump=_result;}
return true;}}
return false;}
function writeNode(state,level,object,block,compact,iskey){state.tag=null;state.dump=object;if(!detectType(state,object,false)){detectType(state,object,true);}
var type=_toString.call(state.dump);if(block){block=(state.flowLevel<0||state.flowLevel>level);}
var objectOrArray=type==='[object Object]'||type==='[object Array]',duplicateIndex,duplicate;if(objectOrArray){duplicateIndex=state.duplicates.indexOf(object);duplicate=duplicateIndex!==-1;}
if((state.tag!==null&&state.tag!=='?')||duplicate||(state.indent!==2&&level>0)){compact=false;}
if(duplicate&&state.usedDuplicates[duplicateIndex]){state.dump='*ref_'+duplicateIndex;}else{if(objectOrArray&&duplicate&&!state.usedDuplicates[duplicateIndex]){state.usedDuplicates[duplicateIndex]=true;}
if(type==='[object Object]'){if(block&&(Object.keys(state.dump).length!==0)){writeBlockMapping(state,level,state.dump,compact);if(duplicate){state.dump='&ref_'+duplicateIndex+state.dump;}}else{writeFlowMapping(state,level,state.dump);if(duplicate){state.dump='&ref_'+duplicateIndex+' '+state.dump;}}}else if(type==='[object Array]'){if(block&&(state.dump.length!==0)){writeBlockSequence(state,level,state.dump,compact);if(duplicate){state.dump='&ref_'+duplicateIndex+state.dump;}}else{writeFlowSequence(state,level,state.dump);if(duplicate){state.dump='&ref_'+duplicateIndex+' '+state.dump;}}}else if(type==='[object String]'){if(state.tag!=='?'){writeScalar(state,state.dump,level,iskey);}}else{if(state.skipInvalid)return false;throw new YAMLException('unacceptable kind of an object to dump '+type);}
if(state.tag!==null&&state.tag!=='?'){state.dump='!<'+state.tag+'> '+state.dump;}}
return true;}
function getDuplicateReferences(object,state){var objects=[],duplicatesIndexes=[],index,length;inspectNode(object,objects,duplicatesIndexes);for(index=0,length=duplicatesIndexes.length;index<length;index+=1){state.duplicates.push(objects[duplicatesIndexes[index]]);}
state.usedDuplicates=new Array(length);}
function inspectNode(object,objects,duplicatesIndexes){var objectKeyList,index,length;if(object!==null&&typeof object==='object'){index=objects.indexOf(object);if(index!==-1){if(duplicatesIndexes.indexOf(index)===-1){duplicatesIndexes.push(index);}}else{objects.push(object);if(Array.isArray(object)){for(index=0,length=object.length;index<length;index+=1){inspectNode(object[index],objects,duplicatesIndexes);}}else{objectKeyList=Object.keys(object);for(index=0,length=objectKeyList.length;index<length;index+=1){inspectNode(object[objectKeyList[index]],objects,duplicatesIndexes);}}}}}
function dump(input,options){options=options||{};var state=new State(options);if(!state.noRefs)getDuplicateReferences(input,state);if(writeNode(state,0,input,true,true))return state.dump+'\n';return'';}
function safeDump(input,options){return dump(input,common.extend({schema:DEFAULT_SAFE_SCHEMA},options));}
module.exports.dump=dump;module.exports.safeDump=safeDump;},{"./common":2,"./exception":4,"./schema/default_full":9,"./schema/default_safe":10}],4:[function(require,module,exports){'use strict';function YAMLException(reason,mark){Error.call(this);if(Error.captureStackTrace){Error.captureStackTrace(this,this.constructor);}else{this.stack=(new Error()).stack||'';}
this.name='YAMLException';this.reason=reason;this.mark=mark;this.message=(this.reason||'(unknown reason)')+(this.mark?' '+this.mark.toString():'');}
YAMLException.prototype=Object.create(Error.prototype);YAMLException.prototype.constructor=YAMLException;YAMLException.prototype.toString=function toString(compact){var result=this.name+': ';result+=this.reason||'(unknown reason)';if(!compact&&this.mark){result+=' '+this.mark.toString();}
return result;};module.exports=YAMLException;},{}],5:[function(require,module,exports){'use strict';var common=require('./common');var YAMLException=require('./exception');var Mark=require('./mark');var DEFAULT_SAFE_SCHEMA=require('./schema/default_safe');var DEFAULT_FULL_SCHEMA=require('./schema/default_full');var _hasOwnProperty=Object.prototype.hasOwnProperty;var CONTEXT_FLOW_IN=1;var CONTEXT_FLOW_OUT=2;var CONTEXT_BLOCK_IN=3;var CONTEXT_BLOCK_OUT=4;var CHOMPING_CLIP=1;var CHOMPING_STRIP=2;var CHOMPING_KEEP=3;var PATTERN_NON_PRINTABLE=/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;var PATTERN_NON_ASCII_LINE_BREAKS=/[\x85\u2028\u2029]/;var PATTERN_FLOW_INDICATORS=/[,\[\]\{\}]/;var PATTERN_TAG_HANDLE=/^(?:!|!!|![a-z\-]+!)$/i;var PATTERN_TAG_URI=/^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;function is_EOL(c){return(c===0x0A )||(c===0x0D );}
function is_WHITE_SPACE(c){return(c===0x09 )||(c===0x20 );}
function is_WS_OR_EOL(c){return(c===0x09 )||(c===0x20 )||(c===0x0A )||(c===0x0D );}
function is_FLOW_INDICATOR(c){return c===0x2C ||c===0x5B ||c===0x5D ||c===0x7B ||c===0x7D ;}
function fromHexCode(c){var lc;if((0x30 <=c)&&(c<=0x39 )){return c-0x30;}
lc=c|0x20;if((0x61 <=lc)&&(lc<=0x66 )){return lc-0x61+10;}
return-1;}
function escapedHexLen(c){if(c===0x78 ){return 2;}
if(c===0x75 ){return 4;}
if(c===0x55 ){return 8;}
return 0;}
function fromDecimalCode(c){if((0x30 <=c)&&(c<=0x39 )){return c-0x30;}
return-1;}
function simpleEscapeSequence(c){return(c===0x30 )?'\x00':(c===0x61 )?'\x07':(c===0x62 )?'\x08':(c===0x74 )?'\x09':(c===0x09 )?'\x09':(c===0x6E )?'\x0A':(c===0x76 )?'\x0B':(c===0x66 )?'\x0C':(c===0x72 )?'\x0D':(c===0x65 )?'\x1B':(c===0x20 )?' ':(c===0x22 )?'\x22':(c===0x2F )?'/':(c===0x5C )?'\x5C':(c===0x4E )?'\x85':(c===0x5F )?'\xA0':(c===0x4C )?'\u2028':(c===0x50 )?'\u2029':'';}
function charFromCodepoint(c){if(c<=0xFFFF){return String.fromCharCode(c);}
return String.fromCharCode(((c-0x010000)>>10)+0xD800,((c-0x010000)&0x03FF)+0xDC00);}
var simpleEscapeCheck=new Array(256);var simpleEscapeMap=new Array(256);for(var i=0;i<256;i++){simpleEscapeCheck[i]=simpleEscapeSequence(i)?1:0;simpleEscapeMap[i]=simpleEscapeSequence(i);}
function State(input,options){this.input=input;this.filename=options['filename']||null;this.schema=options['schema']||DEFAULT_FULL_SCHEMA;this.onWarning=options['onWarning']||null;this.legacy=options['legacy']||false;this.json=options['json']||false;this.listener=options['listener']||null;this.implicitTypes=this.schema.compiledImplicit;this.typeMap=this.schema.compiledTypeMap;this.length=input.length;this.position=0;this.line=0;this.lineStart=0;this.lineIndent=0;this.documents=[];}
function generateError(state,message){return new YAMLException(message,new Mark(state.filename,state.input,state.position,state.line,(state.position-state.lineStart)));}
function throwError(state,message){throw generateError(state,message);}
function throwWarning(state,message){if(state.onWarning){state.onWarning.call(null,generateError(state,message));}}
var directiveHandlers={YAML:function handleYamlDirective(state,name,args){var match,major,minor;if(state.version!==null){throwError(state,'duplication of %YAML directive');}
if(args.length!==1){throwError(state,'YAML directive accepts exactly one argument');}
match=/^([0-9]+)\.([0-9]+)$/.exec(args[0]);if(match===null){throwError(state,'ill-formed argument of the YAML directive');}
major=parseInt(match[1],10);minor=parseInt(match[2],10);if(major!==1){throwError(state,'unacceptable YAML version of the document');}
state.version=args[0];state.checkLineBreaks=(minor<2);if(minor!==1&&minor!==2){throwWarning(state,'unsupported YAML version of the document');}},TAG:function handleTagDirective(state,name,args){var handle,prefix;if(args.length!==2){throwError(state,'TAG directive accepts exactly two arguments');}
handle=args[0];prefix=args[1];if(!PATTERN_TAG_HANDLE.test(handle)){throwError(state,'ill-formed tag handle (first argument) of the TAG directive');}
if(_hasOwnProperty.call(state.tagMap,handle)){throwError(state,'there is a previously declared suffix for "'+handle+'" tag handle');}
if(!PATTERN_TAG_URI.test(prefix)){throwError(state,'ill-formed tag prefix (second argument) of the TAG directive');}
state.tagMap[handle]=prefix;}};function captureSegment(state,start,end,checkJson){var _position,_length,_character,_result;if(start<end){_result=state.input.slice(start,end);if(checkJson){for(_position=0,_length=_result.length;_position<_length;_position+=1){_character=_result.charCodeAt(_position);if(!(_character===0x09||(0x20<=_character&&_character<=0x10FFFF))){throwError(state,'expected valid JSON character');}}}else if(PATTERN_NON_PRINTABLE.test(_result)){throwError(state,'the stream contains non-printable characters');}
state.result+=_result;}}
function mergeMappings(state,destination,source,overridableKeys){var sourceKeys,key,index,quantity;if(!common.isObject(source)){throwError(state,'cannot merge mappings; the provided source object is unacceptable');}
sourceKeys=Object.keys(source);for(index=0,quantity=sourceKeys.length;index<quantity;index+=1){key=sourceKeys[index];if(!_hasOwnProperty.call(destination,key)){destination[key]=source[key];overridableKeys[key]=true;}}}
function storeMappingPair(state,_result,overridableKeys,keyTag,keyNode,valueNode){var index,quantity;keyNode=String(keyNode);if(_result===null){_result={};}
if(keyTag==='tag:yaml.org,2002:merge'){if(Array.isArray(valueNode)){for(index=0,quantity=valueNode.length;index<quantity;index+=1){mergeMappings(state,_result,valueNode[index],overridableKeys);}}else{mergeMappings(state,_result,valueNode,overridableKeys);}}else{if(!state.json&&!_hasOwnProperty.call(overridableKeys,keyNode)&&_hasOwnProperty.call(_result,keyNode)){throwError(state,'duplicated mapping key');}
_result[keyNode]=valueNode;delete overridableKeys[keyNode];}
return _result;}
function readLineBreak(state){var ch;ch=state.input.charCodeAt(state.position);if(ch===0x0A ){state.position++;}else if(ch===0x0D ){state.position++;if(state.input.charCodeAt(state.position)===0x0A ){state.position++;}}else{throwError(state,'a line break is expected');}
state.line+=1;state.lineStart=state.position;}
function skipSeparationSpace(state,allowComments,checkIndent){var lineBreaks=0,ch=state.input.charCodeAt(state.position);while(ch!==0){while(is_WHITE_SPACE(ch)){ch=state.input.charCodeAt(++state.position);}
if(allowComments&&ch===0x23 ){do{ch=state.input.charCodeAt(++state.position);}while(ch!==0x0A &&ch!==0x0D &&ch!==0);}
if(is_EOL(ch)){readLineBreak(state);ch=state.input.charCodeAt(state.position);lineBreaks++;state.lineIndent=0;while(ch===0x20 ){state.lineIndent++;ch=state.input.charCodeAt(++state.position);}}else{break;}}
if(checkIndent!==-1&&lineBreaks!==0&&state.lineIndent<checkIndent){throwWarning(state,'deficient indentation');}
return lineBreaks;}
function testDocumentSeparator(state){var _position=state.position,ch;ch=state.input.charCodeAt(_position);if((ch===0x2D ||ch===0x2E )&&ch===state.input.charCodeAt(_position+1)&&ch===state.input.charCodeAt(_position+2)){_position+=3;ch=state.input.charCodeAt(_position);if(ch===0||is_WS_OR_EOL(ch)){return true;}}
return false;}
function writeFoldedLines(state,count){if(count===1){state.result+=' ';}else if(count>1){state.result+=common.repeat('\n',count-1);}}
function readPlainScalar(state,nodeIndent,withinFlowCollection){var preceding,following,captureStart,captureEnd,hasPendingContent,_line,_lineStart,_lineIndent,_kind=state.kind,_result=state.result,ch;ch=state.input.charCodeAt(state.position);if(is_WS_OR_EOL(ch)||is_FLOW_INDICATOR(ch)||ch===0x23 ||ch===0x26 ||ch===0x2A ||ch===0x21 ||ch===0x7C ||ch===0x3E ||ch===0x27 ||ch===0x22 ||ch===0x25 ||ch===0x40 ||ch===0x60 ){return false;}
if(ch===0x3F ||ch===0x2D ){following=state.input.charCodeAt(state.position+1);if(is_WS_OR_EOL(following)||withinFlowCollection&&is_FLOW_INDICATOR(following)){return false;}}
state.kind='scalar';state.result='';captureStart=captureEnd=state.position;hasPendingContent=false;while(ch!==0){if(ch===0x3A ){following=state.input.charCodeAt(state.position+1);if(is_WS_OR_EOL(following)||withinFlowCollection&&is_FLOW_INDICATOR(following)){break;}}else if(ch===0x23 ){preceding=state.input.charCodeAt(state.position-1);if(is_WS_OR_EOL(preceding)){break;}}else if((state.position===state.lineStart&&testDocumentSeparator(state))||withinFlowCollection&&is_FLOW_INDICATOR(ch)){break;}else if(is_EOL(ch)){_line=state.line;_lineStart=state.lineStart;_lineIndent=state.lineIndent;skipSeparationSpace(state,false,-1);if(state.lineIndent>=nodeIndent){hasPendingContent=true;ch=state.input.charCodeAt(state.position);continue;}else{state.position=captureEnd;state.line=_line;state.lineStart=_lineStart;state.lineIndent=_lineIndent;break;}}
if(hasPendingContent){captureSegment(state,captureStart,captureEnd,false);writeFoldedLines(state,state.line-_line);captureStart=captureEnd=state.position;hasPendingContent=false;}
if(!is_WHITE_SPACE(ch)){captureEnd=state.position+1;}
ch=state.input.charCodeAt(++state.position);}
captureSegment(state,captureStart,captureEnd,false);if(state.result){return true;}
state.kind=_kind;state.result=_result;return false;}
function readSingleQuotedScalar(state,nodeIndent){var ch,captureStart,captureEnd;ch=state.input.charCodeAt(state.position);if(ch!==0x27 ){return false;}
state.kind='scalar';state.result='';state.position++;captureStart=captureEnd=state.position;while((ch=state.input.charCodeAt(state.position))!==0){if(ch===0x27 ){captureSegment(state,captureStart,state.position,true);ch=state.input.charCodeAt(++state.position);if(ch===0x27 ){captureStart=captureEnd=state.position;state.position++;}else{return true;}}else if(is_EOL(ch)){captureSegment(state,captureStart,captureEnd,true);writeFoldedLines(state,skipSeparationSpace(state,false,nodeIndent));captureStart=captureEnd=state.position;}else if(state.position===state.lineStart&&testDocumentSeparator(state)){throwError(state,'unexpected end of the document within a single quoted scalar');}else{state.position++;captureEnd=state.position;}}
throwError(state,'unexpected end of the stream within a single quoted scalar');}
function readDoubleQuotedScalar(state,nodeIndent){var captureStart,captureEnd,hexLength,hexResult,tmp,ch;ch=state.input.charCodeAt(state.position);if(ch!==0x22 ){return false;}
state.kind='scalar';state.result='';state.position++;captureStart=captureEnd=state.position;while((ch=state.input.charCodeAt(state.position))!==0){if(ch===0x22 ){captureSegment(state,captureStart,state.position,true);state.position++;return true;}else if(ch===0x5C ){captureSegment(state,captureStart,state.position,true);ch=state.input.charCodeAt(++state.position);if(is_EOL(ch)){skipSeparationSpace(state,false,nodeIndent);}else if(ch<256&&simpleEscapeCheck[ch]){state.result+=simpleEscapeMap[ch];state.position++;}else if((tmp=escapedHexLen(ch))>0){hexLength=tmp;hexResult=0;for(;hexLength>0;hexLength--){ch=state.input.charCodeAt(++state.position);if((tmp=fromHexCode(ch))>=0){hexResult=(hexResult<<4)+tmp;}else{throwError(state,'expected hexadecimal character');}}
state.result+=charFromCodepoint(hexResult);state.position++;}else{throwError(state,'unknown escape sequence');}
captureStart=captureEnd=state.position;}else if(is_EOL(ch)){captureSegment(state,captureStart,captureEnd,true);writeFoldedLines(state,skipSeparationSpace(state,false,nodeIndent));captureStart=captureEnd=state.position;}else if(state.position===state.lineStart&&testDocumentSeparator(state)){throwError(state,'unexpected end of the document within a double quoted scalar');}else{state.position++;captureEnd=state.position;}}
throwError(state,'unexpected end of the stream within a double quoted scalar');}
function readFlowCollection(state,nodeIndent){var readNext=true,_line,_tag=state.tag,_result,_anchor=state.anchor,following,terminator,isPair,isExplicitPair,isMapping,overridableKeys={},keyNode,keyTag,valueNode,ch;ch=state.input.charCodeAt(state.position);if(ch===0x5B ){terminator=0x5D;isMapping=false;_result=[];}else if(ch===0x7B ){terminator=0x7D;isMapping=true;_result={};}else{return false;}
if(state.anchor!==null){state.anchorMap[state.anchor]=_result;}
ch=state.input.charCodeAt(++state.position);while(ch!==0){skipSeparationSpace(state,true,nodeIndent);ch=state.input.charCodeAt(state.position);if(ch===terminator){state.position++;state.tag=_tag;state.anchor=_anchor;state.kind=isMapping?'mapping':'sequence';state.result=_result;return true;}else if(!readNext){throwError(state,'missed comma between flow collection entries');}
keyTag=keyNode=valueNode=null;isPair=isExplicitPair=false;if(ch===0x3F ){following=state.input.charCodeAt(state.position+1);if(is_WS_OR_EOL(following)){isPair=isExplicitPair=true;state.position++;skipSeparationSpace(state,true,nodeIndent);}}
_line=state.line;composeNode(state,nodeIndent,CONTEXT_FLOW_IN,false,true);keyTag=state.tag;keyNode=state.result;skipSeparationSpace(state,true,nodeIndent);ch=state.input.charCodeAt(state.position);if((isExplicitPair||state.line===_line)&&ch===0x3A ){isPair=true;ch=state.input.charCodeAt(++state.position);skipSeparationSpace(state,true,nodeIndent);composeNode(state,nodeIndent,CONTEXT_FLOW_IN,false,true);valueNode=state.result;}
if(isMapping){storeMappingPair(state,_result,overridableKeys,keyTag,keyNode,valueNode);}else if(isPair){_result.push(storeMappingPair(state,null,overridableKeys,keyTag,keyNode,valueNode));}else{_result.push(keyNode);}
skipSeparationSpace(state,true,nodeIndent);ch=state.input.charCodeAt(state.position);if(ch===0x2C ){readNext=true;ch=state.input.charCodeAt(++state.position);}else{readNext=false;}}
throwError(state,'unexpected end of the stream within a flow collection');}
function readBlockScalar(state,nodeIndent){var captureStart,folding,chomping=CHOMPING_CLIP,didReadContent=false,detectedIndent=false,textIndent=nodeIndent,emptyLines=0,atMoreIndented=false,tmp,ch;ch=state.input.charCodeAt(state.position);if(ch===0x7C ){folding=false;}else if(ch===0x3E ){folding=true;}else{return false;}
state.kind='scalar';state.result='';while(ch!==0){ch=state.input.charCodeAt(++state.position);if(ch===0x2B ||ch===0x2D ){if(CHOMPING_CLIP===chomping){chomping=(ch===0x2B )?CHOMPING_KEEP:CHOMPING_STRIP;}else{throwError(state,'repeat of a chomping mode identifier');}}else if((tmp=fromDecimalCode(ch))>=0){if(tmp===0){throwError(state,'bad explicit indentation width of a block scalar; it cannot be less than one');}else if(!detectedIndent){textIndent=nodeIndent+tmp-1;detectedIndent=true;}else{throwError(state,'repeat of an indentation width identifier');}}else{break;}}
if(is_WHITE_SPACE(ch)){do{ch=state.input.charCodeAt(++state.position);}
while(is_WHITE_SPACE(ch));if(ch===0x23 ){do{ch=state.input.charCodeAt(++state.position);}
while(!is_EOL(ch)&&(ch!==0));}}
while(ch!==0){readLineBreak(state);state.lineIndent=0;ch=state.input.charCodeAt(state.position);while((!detectedIndent||state.lineIndent<textIndent)&&(ch===0x20 )){state.lineIndent++;ch=state.input.charCodeAt(++state.position);}
if(!detectedIndent&&state.lineIndent>textIndent){textIndent=state.lineIndent;}
if(is_EOL(ch)){emptyLines++;continue;}
if(state.lineIndent<textIndent){if(chomping===CHOMPING_KEEP){state.result+=common.repeat('\n',didReadContent?1+emptyLines:emptyLines);}else if(chomping===CHOMPING_CLIP){if(didReadContent){state.result+='\n';}}
break;}
if(folding){if(is_WHITE_SPACE(ch)){atMoreIndented=true;state.result+=common.repeat('\n',didReadContent?1+emptyLines:emptyLines);}else if(atMoreIndented){atMoreIndented=false;state.result+=common.repeat('\n',emptyLines+1);}else if(emptyLines===0){if(didReadContent){state.result+=' ';}
}else{state.result+=common.repeat('\n',emptyLines);}
}else{state.result+=common.repeat('\n',didReadContent?1+emptyLines:emptyLines);}
didReadContent=true;detectedIndent=true;emptyLines=0;captureStart=state.position;while(!is_EOL(ch)&&(ch!==0)){ch=state.input.charCodeAt(++state.position);}
captureSegment(state,captureStart,state.position,false);}
return true;}
function readBlockSequence(state,nodeIndent){var _line,_tag=state.tag,_anchor=state.anchor,_result=[],following,detected=false,ch;if(state.anchor!==null){state.anchorMap[state.anchor]=_result;}
ch=state.input.charCodeAt(state.position);while(ch!==0){if(ch!==0x2D ){break;}
following=state.input.charCodeAt(state.position+1);if(!is_WS_OR_EOL(following)){break;}
detected=true;state.position++;if(skipSeparationSpace(state,true,-1)){if(state.lineIndent<=nodeIndent){_result.push(null);ch=state.input.charCodeAt(state.position);continue;}}
_line=state.line;composeNode(state,nodeIndent,CONTEXT_BLOCK_IN,false,true);_result.push(state.result);skipSeparationSpace(state,true,-1);ch=state.input.charCodeAt(state.position);if((state.line===_line||state.lineIndent>nodeIndent)&&(ch!==0)){throwError(state,'bad indentation of a sequence entry');}else if(state.lineIndent<nodeIndent){break;}}
if(detected){state.tag=_tag;state.anchor=_anchor;state.kind='sequence';state.result=_result;return true;}
return false;}
function readBlockMapping(state,nodeIndent,flowIndent){var following,allowCompact,_line,_tag=state.tag,_anchor=state.anchor,_result={},overridableKeys={},keyTag=null,keyNode=null,valueNode=null,atExplicitKey=false,detected=false,ch;if(state.anchor!==null){state.anchorMap[state.anchor]=_result;}
ch=state.input.charCodeAt(state.position);while(ch!==0){following=state.input.charCodeAt(state.position+1);_line=state.line;if((ch===0x3F ||ch===0x3A )&&is_WS_OR_EOL(following)){if(ch===0x3F ){if(atExplicitKey){storeMappingPair(state,_result,overridableKeys,keyTag,keyNode,null);keyTag=keyNode=valueNode=null;}
detected=true;atExplicitKey=true;allowCompact=true;}else if(atExplicitKey){atExplicitKey=false;allowCompact=true;}else{throwError(state,'incomplete explicit mapping pair; a key node is missed');}
state.position+=1;ch=following;}else if(composeNode(state,flowIndent,CONTEXT_FLOW_OUT,false,true)){if(state.line===_line){ch=state.input.charCodeAt(state.position);while(is_WHITE_SPACE(ch)){ch=state.input.charCodeAt(++state.position);}
if(ch===0x3A ){ch=state.input.charCodeAt(++state.position);if(!is_WS_OR_EOL(ch)){throwError(state,'a whitespace character is expected after the key-value separator within a block mapping');}
if(atExplicitKey){storeMappingPair(state,_result,overridableKeys,keyTag,keyNode,null);keyTag=keyNode=valueNode=null;}
detected=true;atExplicitKey=false;allowCompact=false;keyTag=state.tag;keyNode=state.result;}else if(detected){throwError(state,'can not read an implicit mapping pair; a colon is missed');}else{state.tag=_tag;state.anchor=_anchor;return true;}}else if(detected){throwError(state,'can not read a block mapping entry; a multiline key may not be an implicit key');}else{state.tag=_tag;state.anchor=_anchor;return true;}}else{break;}
if(state.line===_line||state.lineIndent>nodeIndent){if(composeNode(state,nodeIndent,CONTEXT_BLOCK_OUT,true,allowCompact)){if(atExplicitKey){keyNode=state.result;}else{valueNode=state.result;}}
if(!atExplicitKey){storeMappingPair(state,_result,overridableKeys,keyTag,keyNode,valueNode);keyTag=keyNode=valueNode=null;}
skipSeparationSpace(state,true,-1);ch=state.input.charCodeAt(state.position);}
if(state.lineIndent>nodeIndent&&(ch!==0)){throwError(state,'bad indentation of a mapping entry');}else if(state.lineIndent<nodeIndent){break;}}
if(atExplicitKey){storeMappingPair(state,_result,overridableKeys,keyTag,keyNode,null);}
if(detected){state.tag=_tag;state.anchor=_anchor;state.kind='mapping';state.result=_result;}
return detected;}
function readTagProperty(state){var _position,isVerbatim=false,isNamed=false,tagHandle,tagName,ch;ch=state.input.charCodeAt(state.position);if(ch!==0x21 )return false;if(state.tag!==null){throwError(state,'duplication of a tag property');}
ch=state.input.charCodeAt(++state.position);if(ch===0x3C ){isVerbatim=true;ch=state.input.charCodeAt(++state.position);}else if(ch===0x21 ){isNamed=true;tagHandle='!!';ch=state.input.charCodeAt(++state.position);}else{tagHandle='!';}
_position=state.position;if(isVerbatim){do{ch=state.input.charCodeAt(++state.position);}
while(ch!==0&&ch!==0x3E );if(state.position<state.length){tagName=state.input.slice(_position,state.position);ch=state.input.charCodeAt(++state.position);}else{throwError(state,'unexpected end of the stream within a verbatim tag');}}else{while(ch!==0&&!is_WS_OR_EOL(ch)){if(ch===0x21 ){if(!isNamed){tagHandle=state.input.slice(_position-1,state.position+1);if(!PATTERN_TAG_HANDLE.test(tagHandle)){throwError(state,'named tag handle cannot contain such characters');}
isNamed=true;_position=state.position+1;}else{throwError(state,'tag suffix cannot contain exclamation marks');}}
ch=state.input.charCodeAt(++state.position);}
tagName=state.input.slice(_position,state.position);if(PATTERN_FLOW_INDICATORS.test(tagName)){throwError(state,'tag suffix cannot contain flow indicator characters');}}
if(tagName&&!PATTERN_TAG_URI.test(tagName)){throwError(state,'tag name cannot contain such characters: '+tagName);}
if(isVerbatim){state.tag=tagName;}else if(_hasOwnProperty.call(state.tagMap,tagHandle)){state.tag=state.tagMap[tagHandle]+tagName;}else if(tagHandle==='!'){state.tag='!'+tagName;}else if(tagHandle==='!!'){state.tag='tag:yaml.org,2002:'+tagName;}else{throwError(state,'undeclared tag handle "'+tagHandle+'"');}
return true;}
function readAnchorProperty(state){var _position,ch;ch=state.input.charCodeAt(state.position);if(ch!==0x26 )return false;if(state.anchor!==null){throwError(state,'duplication of an anchor property');}
ch=state.input.charCodeAt(++state.position);_position=state.position;while(ch!==0&&!is_WS_OR_EOL(ch)&&!is_FLOW_INDICATOR(ch)){ch=state.input.charCodeAt(++state.position);}
if(state.position===_position){throwError(state,'name of an anchor node must contain at least one character');}
state.anchor=state.input.slice(_position,state.position);return true;}
function readAlias(state){var _position,alias,ch;ch=state.input.charCodeAt(state.position);if(ch!==0x2A )return false;ch=state.input.charCodeAt(++state.position);_position=state.position;while(ch!==0&&!is_WS_OR_EOL(ch)&&!is_FLOW_INDICATOR(ch)){ch=state.input.charCodeAt(++state.position);}
if(state.position===_position){throwError(state,'name of an alias node must contain at least one character');}
alias=state.input.slice(_position,state.position);if(!state.anchorMap.hasOwnProperty(alias)){throwError(state,'unidentified alias "'+alias+'"');}
state.result=state.anchorMap[alias];skipSeparationSpace(state,true,-1);return true;}
function composeNode(state,parentIndent,nodeContext,allowToSeek,allowCompact){var allowBlockStyles,allowBlockScalars,allowBlockCollections,indentStatus=1,atNewLine=false,hasContent=false,typeIndex,typeQuantity,type,flowIndent,blockIndent;if(state.listener!==null){state.listener('open',state);}
state.tag=null;state.anchor=null;state.kind=null;state.result=null;allowBlockStyles=allowBlockScalars=allowBlockCollections=CONTEXT_BLOCK_OUT===nodeContext||CONTEXT_BLOCK_IN===nodeContext;if(allowToSeek){if(skipSeparationSpace(state,true,-1)){atNewLine=true;if(state.lineIndent>parentIndent){indentStatus=1;}else if(state.lineIndent===parentIndent){indentStatus=0;}else if(state.lineIndent<parentIndent){indentStatus=-1;}}}
if(indentStatus===1){while(readTagProperty(state)||readAnchorProperty(state)){if(skipSeparationSpace(state,true,-1)){atNewLine=true;allowBlockCollections=allowBlockStyles;if(state.lineIndent>parentIndent){indentStatus=1;}else if(state.lineIndent===parentIndent){indentStatus=0;}else if(state.lineIndent<parentIndent){indentStatus=-1;}}else{allowBlockCollections=false;}}}
if(allowBlockCollections){allowBlockCollections=atNewLine||allowCompact;}
if(indentStatus===1||CONTEXT_BLOCK_OUT===nodeContext){if(CONTEXT_FLOW_IN===nodeContext||CONTEXT_FLOW_OUT===nodeContext){flowIndent=parentIndent;}else{flowIndent=parentIndent+1;}
blockIndent=state.position-state.lineStart;if(indentStatus===1){if(allowBlockCollections&&(readBlockSequence(state,blockIndent)||readBlockMapping(state,blockIndent,flowIndent))||readFlowCollection(state,flowIndent)){hasContent=true;}else{if((allowBlockScalars&&readBlockScalar(state,flowIndent))||readSingleQuotedScalar(state,flowIndent)||readDoubleQuotedScalar(state,flowIndent)){hasContent=true;}else if(readAlias(state)){hasContent=true;if(state.tag!==null||state.anchor!==null){throwError(state,'alias node should not have any properties');}}else if(readPlainScalar(state,flowIndent,CONTEXT_FLOW_IN===nodeContext)){hasContent=true;if(state.tag===null){state.tag='?';}}
if(state.anchor!==null){state.anchorMap[state.anchor]=state.result;}}}else if(indentStatus===0){hasContent=allowBlockCollections&&readBlockSequence(state,blockIndent);}}
if(state.tag!==null&&state.tag!=='!'){if(state.tag==='?'){for(typeIndex=0,typeQuantity=state.implicitTypes.length;typeIndex<typeQuantity;typeIndex+=1){type=state.implicitTypes[typeIndex];if(type.resolve(state.result)){state.result=type.construct(state.result);state.tag=type.tag;if(state.anchor!==null){state.anchorMap[state.anchor]=state.result;}
break;}}}else if(_hasOwnProperty.call(state.typeMap,state.tag)){type=state.typeMap[state.tag];if(state.result!==null&&type.kind!==state.kind){throwError(state,'unacceptable node kind for !<'+state.tag+'> tag; it should be "'+type.kind+'", not "'+state.kind+'"');}
if(!type.resolve(state.result)){throwError(state,'cannot resolve a node with !<'+state.tag+'> explicit tag');}else{state.result=type.construct(state.result);if(state.anchor!==null){state.anchorMap[state.anchor]=state.result;}}}else{throwError(state,'unknown tag !<'+state.tag+'>');}}
if(state.listener!==null){state.listener('close',state);}
return state.tag!==null||state.anchor!==null||hasContent;}
function readDocument(state){var documentStart=state.position,_position,directiveName,directiveArgs,hasDirectives=false,ch;state.version=null;state.checkLineBreaks=state.legacy;state.tagMap={};state.anchorMap={};while((ch=state.input.charCodeAt(state.position))!==0){skipSeparationSpace(state,true,-1);ch=state.input.charCodeAt(state.position);if(state.lineIndent>0||ch!==0x25 ){break;}
hasDirectives=true;ch=state.input.charCodeAt(++state.position);_position=state.position;while(ch!==0&&!is_WS_OR_EOL(ch)){ch=state.input.charCodeAt(++state.position);}
directiveName=state.input.slice(_position,state.position);directiveArgs=[];if(directiveName.length<1){throwError(state,'directive name must not be less than one character in length');}
while(ch!==0){while(is_WHITE_SPACE(ch)){ch=state.input.charCodeAt(++state.position);}
if(ch===0x23 ){do{ch=state.input.charCodeAt(++state.position);}
while(ch!==0&&!is_EOL(ch));break;}
if(is_EOL(ch))break;_position=state.position;while(ch!==0&&!is_WS_OR_EOL(ch)){ch=state.input.charCodeAt(++state.position);}
directiveArgs.push(state.input.slice(_position,state.position));}
if(ch!==0)readLineBreak(state);if(_hasOwnProperty.call(directiveHandlers,directiveName)){directiveHandlers[directiveName](state,directiveName,directiveArgs);}else{throwWarning(state,'unknown document directive "'+directiveName+'"');}}
skipSeparationSpace(state,true,-1);if(state.lineIndent===0&&state.input.charCodeAt(state.position)===0x2D &&state.input.charCodeAt(state.position+1)===0x2D &&state.input.charCodeAt(state.position+2)===0x2D ){state.position+=3;skipSeparationSpace(state,true,-1);}else if(hasDirectives){throwError(state,'directives end mark is expected');}
composeNode(state,state.lineIndent-1,CONTEXT_BLOCK_OUT,false,true);skipSeparationSpace(state,true,-1);if(state.checkLineBreaks&&PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart,state.position))){throwWarning(state,'non-ASCII line breaks are interpreted as content');}
state.documents.push(state.result);if(state.position===state.lineStart&&testDocumentSeparator(state)){if(state.input.charCodeAt(state.position)===0x2E ){state.position+=3;skipSeparationSpace(state,true,-1);}
return;}
if(state.position<(state.length-1)){throwError(state,'end of the stream or a document separator is expected');}else{return;}}
function loadDocuments(input,options){input=String(input);options=options||{};if(input.length!==0){if(input.charCodeAt(input.length-1)!==0x0A &&input.charCodeAt(input.length-1)!==0x0D ){input+='\n';}
if(input.charCodeAt(0)===0xFEFF){input=input.slice(1);}}
var state=new State(input,options);state.input+='\0';while(state.input.charCodeAt(state.position)===0x20 ){state.lineIndent+=1;state.position+=1;}
while(state.position<(state.length-1)){readDocument(state);}
return state.documents;}
function loadAll(input,iterator,options){var documents=loadDocuments(input,options),index,length;for(index=0,length=documents.length;index<length;index+=1){iterator(documents[index]);}}
function load(input,options){var documents=loadDocuments(input,options);if(documents.length===0){return undefined;}else if(documents.length===1){return documents[0];}
throw new YAMLException('expected a single document in the stream, but found more');}
function safeLoadAll(input,output,options){loadAll(input,output,common.extend({schema:DEFAULT_SAFE_SCHEMA},options));}
function safeLoad(input,options){return load(input,common.extend({schema:DEFAULT_SAFE_SCHEMA},options));}
module.exports.loadAll=loadAll;module.exports.load=load;module.exports.safeLoadAll=safeLoadAll;module.exports.safeLoad=safeLoad;},{"./common":2,"./exception":4,"./mark":6,"./schema/default_full":9,"./schema/default_safe":10}],6:[function(require,module,exports){'use strict';var common=require('./common');function Mark(name,buffer,position,line,column){this.name=name;this.buffer=buffer;this.position=position;this.line=line;this.column=column;}
Mark.prototype.getSnippet=function getSnippet(indent,maxLength){var head,start,tail,end,snippet;if(!this.buffer)return null;indent=indent||4;maxLength=maxLength||75;head='';start=this.position;while(start>0&&'\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(start-1))===-1){start-=1;if(this.position-start>(maxLength/2-1)){head=' ... ';start+=5;break;}}
tail='';end=this.position;while(end<this.buffer.length&&'\x00\r\n\x85\u2028\u2029'.indexOf(this.buffer.charAt(end))===-1){end+=1;if(end-this.position>(maxLength/2-1)){tail=' ... ';end-=5;break;}}
snippet=this.buffer.slice(start,end);return common.repeat(' ',indent)+head+snippet+tail+'\n'+
common.repeat(' ',indent+this.position-start+head.length)+'^';};Mark.prototype.toString=function toString(compact){var snippet,where='';if(this.name){where+='in "'+this.name+'" ';}
where+='at line '+(this.line+1)+', column '+(this.column+1);if(!compact){snippet=this.getSnippet();if(snippet){where+=':\n'+snippet;}}
return where;};module.exports=Mark;},{"./common":2}],7:[function(require,module,exports){'use strict';var common=require('./common');var YAMLException=require('./exception');var Type=require('./type');function compileList(schema,name,result){var exclude=[];schema.include.forEach(function(includedSchema){result=compileList(includedSchema,name,result);});schema[name].forEach(function(currentType){result.forEach(function(previousType,previousIndex){if(previousType.tag===currentType.tag){exclude.push(previousIndex);}});result.push(currentType);});return result.filter(function(type,index){return exclude.indexOf(index)===-1;});}
function compileMap(){var result={},index,length;function collectType(type){result[type.tag]=type;}
for(index=0,length=arguments.length;index<length;index+=1){arguments[index].forEach(collectType);}
return result;}
function Schema(definition){this.include=definition.include||[];this.implicit=definition.implicit||[];this.explicit=definition.explicit||[];this.implicit.forEach(function(type){if(type.loadKind&&type.loadKind!=='scalar'){throw new YAMLException('There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.');}});this.compiledImplicit=compileList(this,'implicit',[]);this.compiledExplicit=compileList(this,'explicit',[]);this.compiledTypeMap=compileMap(this.compiledImplicit,this.compiledExplicit);}
Schema.DEFAULT=null;Schema.create=function createSchema(){var schemas,types;switch(arguments.length){case 1:schemas=Schema.DEFAULT;types=arguments[0];break;case 2:schemas=arguments[0];types=arguments[1];break;default:throw new YAMLException('Wrong number of arguments for Schema.create function');}
schemas=common.toArray(schemas);types=common.toArray(types);if(!schemas.every(function(schema){return schema instanceof Schema;})){throw new YAMLException('Specified list of super schemas (or a single Schema object) contains a non-Schema object.');}
if(!types.every(function(type){return type instanceof Type;})){throw new YAMLException('Specified list of YAML types (or a single Type object) contains a non-Type object.');}
return new Schema({include:schemas,explicit:types});};module.exports=Schema;},{"./common":2,"./exception":4,"./type":13}],8:[function(require,module,exports){'use strict';var Schema=require('../schema');module.exports=new Schema({include:[require('./json')]});},{"../schema":7,"./json":12}],9:[function(require,module,exports){'use strict';var Schema=require('../schema');module.exports=Schema.DEFAULT=new Schema({include:[require('./default_safe')],explicit:[require('../type/js/undefined'),require('../type/js/regexp'),require('../type/js/function')]});},{"../schema":7,"../type/js/function":18,"../type/js/regexp":19,"../type/js/undefined":20,"./default_safe":10}],10:[function(require,module,exports){'use strict';var Schema=require('../schema');module.exports=new Schema({include:[require('./core')],implicit:[require('../type/timestamp'),require('../type/merge')],explicit:[require('../type/binary'),require('../type/omap'),require('../type/pairs'),require('../type/set')]});},{"../schema":7,"../type/binary":14,"../type/merge":22,"../type/omap":24,"../type/pairs":25,"../type/set":27,"../type/timestamp":29,"./core":8}],11:[function(require,module,exports){'use strict';var Schema=require('../schema');module.exports=new Schema({explicit:[require('../type/str'),require('../type/seq'),require('../type/map')]});},{"../schema":7,"../type/map":21,"../type/seq":26,"../type/str":28}],12:[function(require,module,exports){'use strict';var Schema=require('../schema');module.exports=new Schema({include:[require('./failsafe')],implicit:[require('../type/null'),require('../type/bool'),require('../type/int'),require('../type/float')]});},{"../schema":7,"../type/bool":15,"../type/float":16,"../type/int":17,"../type/null":23,"./failsafe":11}],13:[function(require,module,exports){'use strict';var YAMLException=require('./exception');var TYPE_CONSTRUCTOR_OPTIONS=['kind','resolve','construct','instanceOf','predicate','represent','defaultStyle','styleAliases'];var YAML_NODE_KINDS=['scalar','sequence','mapping'];function compileStyleAliases(map){var result={};if(map!==null){Object.keys(map).forEach(function(style){map[style].forEach(function(alias){result[String(alias)]=style;});});}
return result;}
function Type(tag,options){options=options||{};Object.keys(options).forEach(function(name){if(TYPE_CONSTRUCTOR_OPTIONS.indexOf(name)===-1){throw new YAMLException('Unknown option "'+name+'" is met in definition of "'+tag+'" YAML type.');}});this.tag=tag;this.kind=options['kind']||null;this.resolve=options['resolve']||function(){return true;};this.construct=options['construct']||function(data){return data;};this.instanceOf=options['instanceOf']||null;this.predicate=options['predicate']||null;this.represent=options['represent']||null;this.defaultStyle=options['defaultStyle']||null;this.styleAliases=compileStyleAliases(options['styleAliases']||null);if(YAML_NODE_KINDS.indexOf(this.kind)===-1){throw new YAMLException('Unknown kind "'+this.kind+'" is specified for "'+tag+'" YAML type.');}}
module.exports=Type;},{"./exception":4}],14:[function(require,module,exports){'use strict';var NodeBuffer;try{var _require=require;NodeBuffer=_require('buffer').Buffer;}catch(__){}
var Type=require('../type');var BASE64_MAP='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r';function resolveYamlBinary(data){if(data===null)return false;var code,idx,bitlen=0,max=data.length,map=BASE64_MAP;for(idx=0;idx<max;idx++){code=map.indexOf(data.charAt(idx));if(code>64)continue;if(code<0)return false;bitlen+=6;}
return(bitlen%8)===0;}
function constructYamlBinary(data){var idx,tailbits,input=data.replace(/[\r\n=]/g,''),max=input.length,map=BASE64_MAP,bits=0,result=[];for(idx=0;idx<max;idx++){if((idx%4===0)&&idx){result.push((bits>>16)&0xFF);result.push((bits>>8)&0xFF);result.push(bits&0xFF);}
bits=(bits<<6)|map.indexOf(input.charAt(idx));}
tailbits=(max%4)*6;if(tailbits===0){result.push((bits>>16)&0xFF);result.push((bits>>8)&0xFF);result.push(bits&0xFF);}else if(tailbits===18){result.push((bits>>10)&0xFF);result.push((bits>>2)&0xFF);}else if(tailbits===12){result.push((bits>>4)&0xFF);}
if(NodeBuffer)return new NodeBuffer(result);return result;}
function representYamlBinary(object ){var result='',bits=0,idx,tail,max=object.length,map=BASE64_MAP;for(idx=0;idx<max;idx++){if((idx%3===0)&&idx){result+=map[(bits>>18)&0x3F];result+=map[(bits>>12)&0x3F];result+=map[(bits>>6)&0x3F];result+=map[bits&0x3F];}
bits=(bits<<8)+object[idx];}
tail=max%3;if(tail===0){result+=map[(bits>>18)&0x3F];result+=map[(bits>>12)&0x3F];result+=map[(bits>>6)&0x3F];result+=map[bits&0x3F];}else if(tail===2){result+=map[(bits>>10)&0x3F];result+=map[(bits>>4)&0x3F];result+=map[(bits<<2)&0x3F];result+=map[64];}else if(tail===1){result+=map[(bits>>2)&0x3F];result+=map[(bits<<4)&0x3F];result+=map[64];result+=map[64];}
return result;}
function isBinary(object){return NodeBuffer&&NodeBuffer.isBuffer(object);}
module.exports=new Type('tag:yaml.org,2002:binary',{kind:'scalar',resolve:resolveYamlBinary,construct:constructYamlBinary,predicate:isBinary,represent:representYamlBinary});},{"../type":13}],15:[function(require,module,exports){'use strict';var Type=require('../type');function resolveYamlBoolean(data){if(data===null)return false;var max=data.length;return(max===4&&(data==='true'||data==='True'||data==='TRUE'))||(max===5&&(data==='false'||data==='False'||data==='FALSE'));}
function constructYamlBoolean(data){return data==='true'||data==='True'||data==='TRUE';}
function isBoolean(object){return Object.prototype.toString.call(object)==='[object Boolean]';}
module.exports=new Type('tag:yaml.org,2002:bool',{kind:'scalar',resolve:resolveYamlBoolean,construct:constructYamlBoolean,predicate:isBoolean,represent:{lowercase:function(object){return object?'true':'false';},uppercase:function(object){return object?'TRUE':'FALSE';},camelcase:function(object){return object?'True':'False';}},defaultStyle:'lowercase'});},{"../type":13}],16:[function(require,module,exports){'use strict';var common=require('../common');var Type=require('../type');var YAML_FLOAT_PATTERN=new RegExp('^(?:[-+]?(?:[0-9][0-9_]*)\\.[0-9_]*(?:[eE][-+][0-9]+)?'+
'|\\.[0-9_]+(?:[eE][-+][0-9]+)?'+
'|[-+]?[0-9][0-9_]*(?::[0-5]?[0-9])+\\.[0-9_]*'+
'|[-+]?\\.(?:inf|Inf|INF)'+
'|\\.(?:nan|NaN|NAN))$');function resolveYamlFloat(data){if(data===null)return false;if(!YAML_FLOAT_PATTERN.test(data))return false;return true;}
function constructYamlFloat(data){var value,sign,base,digits;value=data.replace(/_/g,'').toLowerCase();sign=value[0]==='-'?-1:1;digits=[];if('+-'.indexOf(value[0])>=0){value=value.slice(1);}
if(value==='.inf'){return(sign===1)?Number.POSITIVE_INFINITY:Number.NEGATIVE_INFINITY;}else if(value==='.nan'){return NaN;}else if(value.indexOf(':')>=0){value.split(':').forEach(function(v){digits.unshift(parseFloat(v,10));});value=0.0;base=1;digits.forEach(function(d){value+=d*base;base*=60;});return sign*value;}
return sign*parseFloat(value,10);}
var SCIENTIFIC_WITHOUT_DOT=/^[-+]?[0-9]+e/;function representYamlFloat(object,style){var res;if(isNaN(object)){switch(style){case'lowercase':return'.nan';case'uppercase':return'.NAN';case'camelcase':return'.NaN';}}else if(Number.POSITIVE_INFINITY===object){switch(style){case'lowercase':return'.inf';case'uppercase':return'.INF';case'camelcase':return'.Inf';}}else if(Number.NEGATIVE_INFINITY===object){switch(style){case'lowercase':return'-.inf';case'uppercase':return'-.INF';case'camelcase':return'-.Inf';}}else if(common.isNegativeZero(object)){return'-0.0';}
res=object.toString(10);return SCIENTIFIC_WITHOUT_DOT.test(res)?res.replace('e','.e'):res;}
function isFloat(object){return(Object.prototype.toString.call(object)==='[object Number]')&&(object%1!==0||common.isNegativeZero(object));}
module.exports=new Type('tag:yaml.org,2002:float',{kind:'scalar',resolve:resolveYamlFloat,construct:constructYamlFloat,predicate:isFloat,represent:representYamlFloat,defaultStyle:'lowercase'});},{"../common":2,"../type":13}],17:[function(require,module,exports){'use strict';var common=require('../common');var Type=require('../type');function isHexCode(c){return((0x30 <=c)&&(c<=0x39 ))||((0x41 <=c)&&(c<=0x46 ))||((0x61 <=c)&&(c<=0x66 ));}
function isOctCode(c){return((0x30 <=c)&&(c<=0x37 ));}
function isDecCode(c){return((0x30 <=c)&&(c<=0x39 ));}
function resolveYamlInteger(data){if(data===null)return false;var max=data.length,index=0,hasDigits=false,ch;if(!max)return false;ch=data[index];if(ch==='-'||ch==='+'){ch=data[++index];}
if(ch==='0'){if(index+1===max)return true;ch=data[++index];if(ch==='b'){index++;for(;index<max;index++){ch=data[index];if(ch==='_')continue;if(ch!=='0'&&ch!=='1')return false;hasDigits=true;}
return hasDigits;}
if(ch==='x'){index++;for(;index<max;index++){ch=data[index];if(ch==='_')continue;if(!isHexCode(data.charCodeAt(index)))return false;hasDigits=true;}
return hasDigits;}
for(;index<max;index++){ch=data[index];if(ch==='_')continue;if(!isOctCode(data.charCodeAt(index)))return false;hasDigits=true;}
return hasDigits;}
for(;index<max;index++){ch=data[index];if(ch==='_')continue;if(ch===':')break;if(!isDecCode(data.charCodeAt(index))){return false;}
hasDigits=true;}
if(!hasDigits)return false;if(ch!==':')return true;return /^(:[0-5]?[0-9])+$/.test(data.slice(index));}
function constructYamlInteger(data){var value=data,sign=1,ch,base,digits=[];if(value.indexOf('_')!==-1){value=value.replace(/_/g,'');}
ch=value[0];if(ch==='-'||ch==='+'){if(ch==='-')sign=-1;value=value.slice(1);ch=value[0];}
if(value==='0')return 0;if(ch==='0'){if(value[1]==='b')return sign*parseInt(value.slice(2),2);if(value[1]==='x')return sign*parseInt(value,16);return sign*parseInt(value,8);}
if(value.indexOf(':')!==-1){value.split(':').forEach(function(v){digits.unshift(parseInt(v,10));});value=0;base=1;digits.forEach(function(d){value+=(d*base);base*=60;});return sign*value;}
return sign*parseInt(value,10);}
function isInteger(object){return(Object.prototype.toString.call(object))==='[object Number]'&&(object%1===0&&!common.isNegativeZero(object));}
module.exports=new Type('tag:yaml.org,2002:int',{kind:'scalar',resolve:resolveYamlInteger,construct:constructYamlInteger,predicate:isInteger,represent:{binary:function(object){return'0b'+object.toString(2);},octal:function(object){return'0'+object.toString(8);},decimal:function(object){return object.toString(10);},hexadecimal:function(object){return'0x'+object.toString(16).toUpperCase();}},defaultStyle:'decimal',styleAliases:{binary:[2,'bin'],octal:[8,'oct'],decimal:[10,'dec'],hexadecimal:[16,'hex']}});},{"../common":2,"../type":13}],18:[function(require,module,exports){'use strict';var esprima;try{var _require=require;esprima=_require('esprima');}catch(_){if(typeof window!=='undefined')esprima=window.esprima;}
var Type=require('../../type');function resolveJavascriptFunction(data){if(data===null)return false;try{var source='('+data+')',ast=esprima.parse(source,{range:true});if(ast.type!=='Program'||ast.body.length!==1||ast.body[0].type!=='ExpressionStatement'||ast.body[0].expression.type!=='FunctionExpression'){return false;}
return true;}catch(err){return false;}}
function constructJavascriptFunction(data){var source='('+data+')',ast=esprima.parse(source,{range:true}),params=[],body;if(ast.type!=='Program'||ast.body.length!==1||ast.body[0].type!=='ExpressionStatement'||ast.body[0].expression.type!=='FunctionExpression'){throw new Error('Failed to resolve function');}
ast.body[0].expression.params.forEach(function(param){params.push(param.name);});body=ast.body[0].expression.body.range;return new Function(params,source.slice(body[0]+1,body[1]-1));}
function representJavascriptFunction(object ){return object.toString();}
function isFunction(object){return Object.prototype.toString.call(object)==='[object Function]';}
module.exports=new Type('tag:yaml.org,2002:js/function',{kind:'scalar',resolve:resolveJavascriptFunction,construct:constructJavascriptFunction,predicate:isFunction,represent:representJavascriptFunction});},{"../../type":13}],19:[function(require,module,exports){'use strict';var Type=require('../../type');function resolveJavascriptRegExp(data){if(data===null)return false;if(data.length===0)return false;var regexp=data,tail=/\/([gim]*)$/.exec(data),modifiers='';if(regexp[0]==='/'){if(tail)modifiers=tail[1];if(modifiers.length>3)return false;if(regexp[regexp.length-modifiers.length-1]!=='/')return false;}
return true;}
function constructJavascriptRegExp(data){var regexp=data,tail=/\/([gim]*)$/.exec(data),modifiers='';if(regexp[0]==='/'){if(tail)modifiers=tail[1];regexp=regexp.slice(1,regexp.length-modifiers.length-1);}
return new RegExp(regexp,modifiers);}
function representJavascriptRegExp(object ){var result='/'+object.source+'/';if(object.global)result+='g';if(object.multiline)result+='m';if(object.ignoreCase)result+='i';return result;}
function isRegExp(object){return Object.prototype.toString.call(object)==='[object RegExp]';}
module.exports=new Type('tag:yaml.org,2002:js/regexp',{kind:'scalar',resolve:resolveJavascriptRegExp,construct:constructJavascriptRegExp,predicate:isRegExp,represent:representJavascriptRegExp});},{"../../type":13}],20:[function(require,module,exports){'use strict';var Type=require('../../type');function resolveJavascriptUndefined(){return true;}
function constructJavascriptUndefined(){return undefined;}
function representJavascriptUndefined(){return'';}
function isUndefined(object){return typeof object==='undefined';}
module.exports=new Type('tag:yaml.org,2002:js/undefined',{kind:'scalar',resolve:resolveJavascriptUndefined,construct:constructJavascriptUndefined,predicate:isUndefined,represent:representJavascriptUndefined});},{"../../type":13}],21:[function(require,module,exports){'use strict';var Type=require('../type');module.exports=new Type('tag:yaml.org,2002:map',{kind:'mapping',construct:function(data){return data!==null?data:{};}});},{"../type":13}],22:[function(require,module,exports){'use strict';var Type=require('../type');function resolveYamlMerge(data){return data==='<<'||data===null;}
module.exports=new Type('tag:yaml.org,2002:merge',{kind:'scalar',resolve:resolveYamlMerge});},{"../type":13}],23:[function(require,module,exports){'use strict';var Type=require('../type');function resolveYamlNull(data){if(data===null)return true;var max=data.length;return(max===1&&data==='~')||(max===4&&(data==='null'||data==='Null'||data==='NULL'));}
function constructYamlNull(){return null;}
function isNull(object){return object===null;}
module.exports=new Type('tag:yaml.org,2002:null',{kind:'scalar',resolve:resolveYamlNull,construct:constructYamlNull,predicate:isNull,represent:{canonical:function(){return'~';},lowercase:function(){return'null';},uppercase:function(){return'NULL';},camelcase:function(){return'Null';}},defaultStyle:'lowercase'});},{"../type":13}],24:[function(require,module,exports){'use strict';var Type=require('../type');var _hasOwnProperty=Object.prototype.hasOwnProperty;var _toString=Object.prototype.toString;function resolveYamlOmap(data){if(data===null)return true;var objectKeys=[],index,length,pair,pairKey,pairHasKey,object=data;for(index=0,length=object.length;index<length;index+=1){pair=object[index];pairHasKey=false;if(_toString.call(pair)!=='[object Object]')return false;for(pairKey in pair){if(_hasOwnProperty.call(pair,pairKey)){if(!pairHasKey)pairHasKey=true;else return false;}}
if(!pairHasKey)return false;if(objectKeys.indexOf(pairKey)===-1)objectKeys.push(pairKey);else return false;}
return true;}
function constructYamlOmap(data){return data!==null?data:[];}
module.exports=new Type('tag:yaml.org,2002:omap',{kind:'sequence',resolve:resolveYamlOmap,construct:constructYamlOmap});},{"../type":13}],25:[function(require,module,exports){'use strict';var Type=require('../type');var _toString=Object.prototype.toString;function resolveYamlPairs(data){if(data===null)return true;var index,length,pair,keys,result,object=data;result=new Array(object.length);for(index=0,length=object.length;index<length;index+=1){pair=object[index];if(_toString.call(pair)!=='[object Object]')return false;keys=Object.keys(pair);if(keys.length!==1)return false;result[index]=[keys[0],pair[keys[0]]];}
return true;}
function constructYamlPairs(data){if(data===null)return[];var index,length,pair,keys,result,object=data;result=new Array(object.length);for(index=0,length=object.length;index<length;index+=1){pair=object[index];keys=Object.keys(pair);result[index]=[keys[0],pair[keys[0]]];}
return result;}
module.exports=new Type('tag:yaml.org,2002:pairs',{kind:'sequence',resolve:resolveYamlPairs,construct:constructYamlPairs});},{"../type":13}],26:[function(require,module,exports){'use strict';var Type=require('../type');module.exports=new Type('tag:yaml.org,2002:seq',{kind:'sequence',construct:function(data){return data!==null?data:[];}});},{"../type":13}],27:[function(require,module,exports){'use strict';var Type=require('../type');var _hasOwnProperty=Object.prototype.hasOwnProperty;function resolveYamlSet(data){if(data===null)return true;var key,object=data;for(key in object){if(_hasOwnProperty.call(object,key)){if(object[key]!==null)return false;}}
return true;}
function constructYamlSet(data){return data!==null?data:{};}
module.exports=new Type('tag:yaml.org,2002:set',{kind:'mapping',resolve:resolveYamlSet,construct:constructYamlSet});},{"../type":13}],28:[function(require,module,exports){'use strict';var Type=require('../type');module.exports=new Type('tag:yaml.org,2002:str',{kind:'scalar',construct:function(data){return data!==null?data:'';}});},{"../type":13}],29:[function(require,module,exports){'use strict';var Type=require('../type');var YAML_DATE_REGEXP=new RegExp('^([0-9][0-9][0-9][0-9])'+
'-([0-9][0-9])'+
'-([0-9][0-9])$');var YAML_TIMESTAMP_REGEXP=new RegExp('^([0-9][0-9][0-9][0-9])'+
'-([0-9][0-9]?)'+
'-([0-9][0-9]?)'+
'(?:[Tt]|[ \\t]+)'+
'([0-9][0-9]?)'+
':([0-9][0-9])'+
':([0-9][0-9])'+
'(?:\\.([0-9]*))?'+
'(?:[ \\t]*(Z|([-+])([0-9][0-9]?)'+
'(?::([0-9][0-9]))?))?$');function resolveYamlTimestamp(data){if(data===null)return false;if(YAML_DATE_REGEXP.exec(data)!==null)return true;if(YAML_TIMESTAMP_REGEXP.exec(data)!==null)return true;return false;}
function constructYamlTimestamp(data){var match,year,month,day,hour,minute,second,fraction=0,delta=null,tz_hour,tz_minute,date;match=YAML_DATE_REGEXP.exec(data);if(match===null)match=YAML_TIMESTAMP_REGEXP.exec(data);if(match===null)throw new Error('Date resolve error');year=+(match[1]);month=+(match[2])-1;day=+(match[3]);if(!match[4]){return new Date(Date.UTC(year,month,day));}
hour=+(match[4]);minute=+(match[5]);second=+(match[6]);if(match[7]){fraction=match[7].slice(0,3);while(fraction.length<3){fraction+='0';}
fraction=+fraction;}
if(match[9]){tz_hour=+(match[10]);tz_minute=+(match[11]||0);delta=(tz_hour*60+tz_minute)*60000;if(match[9]==='-')delta=-delta;}
date=new Date(Date.UTC(year,month,day,hour,minute,second,fraction));if(delta)date.setTime(date.getTime()-delta);return date;}
function representYamlTimestamp(object ){return object.toISOString();}
module.exports=new Type('tag:yaml.org,2002:timestamp',{kind:'scalar',resolve:resolveYamlTimestamp,construct:constructYamlTimestamp,instanceOf:Date,represent:representYamlTimestamp});},{"../type":13}],"/":[function(require,module,exports){'use strict';var yaml=require('./lib/js-yaml.js');module.exports=yaml;},{"./lib/js-yaml.js":1}]},{},[])("/")});