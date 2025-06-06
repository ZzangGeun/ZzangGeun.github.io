---
layout: single
title: "PyTorch를 통해 Transformer 구현하고 이해하기"
excerpt: "Transformer 모델의 구조를 이해하고 PyTorch로 직접 구현해보는 과정을 통해 AI 모델의 핵심 개념을 학습합니다."
categories:
  - AI
  - Deep Learning
tags:
  - PyTorch
  - Transformer
  - Attention
  - NLP
  - Machine Learning
date: 2025-06-06
last_modified_at: 2025-06-06
toc: true
toc_sticky: true
author_profile: true
---

#  1. 🔍 왜 Transformer인가?


## RNN, LSTM 등 기존 모델의 한계

- **병렬 처리 불가 : 순차적으로 들어와 계산을 하기 때문에 이전 타임의 데이터가 출력되기 전엔 계산 불가능**
- **장기 의존성 문제 : 매우 큰 텍스트, 시계열 정보가 들어오면 앞쪽의 입력 정보가 뒤로 전달이 잘 되지 않음 (그래디언트 손실)**
- **연산이 느림 : 게이트 구조로 이루어져 있기 때문에 학습 속도도 느림**

## Attention의 등장

**Attention 메커니즘은 이런 문제를 해결할 수 있는 방법으로 등장했습니다.
특정 입력 단어가 출력 단어에 얼마나 영향을 주는지 가중치로 표현합니다. "중요한 정보에 더 집중하자." 이게 바로 "Attention Score"입니다.**

## Transformer의 혁신

**2017년 구글에서 발표한 "Attention is All You Need" 논문은 RNN, LSTM 없이 오직 Attention만으로 자연어 처리 성능을 크게 끌어 올렸습니다.**

- **완전 병렬화 가능 (GPU 학습 가속)**

- **큰 텍스트도 유연하게 처리**

- **이후 등장한 BERT, GPT 같은 모델의 기반**

# ⚙️ 2. Transformer 구조

![](https://velog.velcdn.com/images/hana_dorobo/post/657628cc-86f4-42d8-84b4-85b4edca0498/image.JPG)

**위 이미지가 Attention is All You Need에 삽입된 이미지입니다.
이 중 빨간색으로 박스 쳐진 부분 중 왼쪽이 Encoder Layer 오른쪽이 Decoder Layer입니다. 또한 인코더는 N개(눈문 기준 6)의 인코더 레이어로 이루어져 있으며 디코더 또한 N개의 디코더 레이어로 이루어져 있습니다.**
## 트랜스포머 블록을 들어가기 전 Positional Encoding이란?

**Transformer는 위에서 설명 드린 것 처럼 문장, 시계열 데이터가 순차적으로 들어가는 것이 아닌 모든 데이터가 한번에 들어가는 형태입니다. 그렇다면 Transformer는 위치 정보를 알지 못한채 들어가게 됩니다. 그러므로 입력된 벡터에 위치 정보를 추가해주는 것이 Postional Encoding입니다.**

![](https://velog.velcdn.com/images/hana_dorobo/post/ee0fa88a-9988-4886-8080-12c008d69c95/image.png)


**논문 Attention is All You Need에서 사용된 방식은 Sinusoidal Positional Encoding으로 sin과 cos함수를 이용하여 짝수 차원 홀수 차원을 지정합니다. 이렇게 되면 인접한 위치끼리는 유사한 값을 갖도록 멀어진 위치는 점차 다른 값을 가지도록 설계한 것입니다.**

| position | dim 0    | dim 1    | dim 2   | dim 3   | dim 4  | dim 5 | dim 6        | dim 7 |
| -------- | -------- | -------- | ------- | ------- | ------ | ----- | ------------ | ----- |
| pos 0    | 0.00000  | 1.00000  | 0.00000 | 1.00000 | 0.0000 | 1.0   | 0.000000e+00 | 1.0   |
| pos 1    | 0.84147  | 0.54030  | 0.01000 | 0.99995 | 0.0001 | 1.0   | 1.000000e-06 | 1.0   |
| pos 2    | 0.90930  | -0.41615 | 0.02000 | 0.99980 | 0.0002 | 1.0   | 2.000000e-06 | 1.0   |
| pos 3    | 0.14112  | -0.98999 | 0.03000 | 0.99955 | 0.0003 | 1.0   | 3.000000e-06 | 1.0   |
| pos 4    | -0.75680 | -0.65364 | 0.03999 | 0.99920 | 0.0004 | 1.0   | 4.000000e-06 | 1.0   |

 (d_model이 8인 예시 표)
 
 **Transformer 모델이 발전 확장되면서 Postional Encoding의 방법도 여러개로 나뉩니다.
 **
 - Learnable Positional Embedding (학습형)
 - Relative Positional Encoding (상대 위치)
 - Rotary Positional Embedding (RoPE)
 
 **위에 나열된 Positional Encoding은 이 글에서는 다루지 않겠습니다.**
 



## 인코더 들어가기 전 알아야 할 Q, K, V 의미

**- Query (Q): 특정 단어가 다른 단어와 어떤 관계를 맺고 있는지 "질문"하는 역할을 합니다. 어떤 정보에 주의를 기울일지 판단하는 데 사용됩니다.**

**- Key (K): 각 단어가 가진 정보를 "열쇠"처럼 나타냅니다. 다른 Query와 비교하여 단어 간의 연관성을 측정하는 데 사용됩니다.**

**- Value (V): 각 단어가 가진 실제 정보를 "값"으로 나타냅니다. Key와 비교하여 중요도를 계산하고, 그에 따라 정보를 가중합하여 최종적으로 중요한 정보를 뽑아냅니다. **

## 인코더 레이어의 구조

- **Multi Head Attention**
- **Feed Forward Network**
- **잔차 연결 + NormLayer**


### MultiHead Attention이란?
![](https://velog.velcdn.com/images/hana_dorobo/post/e92ea30b-2bc8-4282-90a6-af379e6b5e65/image.png)
**MultiHead Attention은 우선 Q, K, V의 벡터 값을 구하기 위해 3개의 Linear(FC, Dense)로 시작합니다. Q,K,V의 Attention Score의 값을 얻은 뒤 Scaled Dot-Product Attention으로 전달합니다.**

**여기서 Scaled Dot-Product Attention이란 Q, K의 가중합을 구한 뒤 Softmax 함수로 확률화를 실시한 뒤 다시 V의 가중합을 구합니다. 이것이 하나의 Scaled Dot-Product Attention입니다.**

**이렇게 Scaled Dot-Product Attention에서 나온 가중합을 Concat 즉 병합하여 Linear 레이어로 확률값을 내는 것이 하나의 MultiHead Attention입니다.**

### Feed Forward Network는 무슨 역할?
**논문 기준으로 구현 된 FFN의 구조는 다음과 같습니다.**
```
nn.Sequential(
    nn.Linear(d_model, d_ff),
    nn.ReLU(),
    nn.Linear(d_ff, d_model)
)
```
**작성된 코드를 보면 2개의 FC레이어와 ReLU레이어가 있습니다. 첫 번째 FC레이어는 들어가는 차원 d_model=512일 경우 d_ff = 2048로 차원을 확장합니다. 이후 ReLU 활성화 레이어를 통해 모델에 비선형성을 도입하여 복잡한 패턴도 학습할 수 있도록 합니다. 마지막으로 두 번째 FC레이어를 통해 확장된 차원을 다시 원래대로 돌려놓는 것이 FNN입니다. Transformer에서의 FFN의 역할은 Attention을 통해 각 단어의 관계성 유사도를 산출한 후 다시 한번 정리를 하는 역할을 FFN이 합니다.**

### 잔차 연결 + 정규화

**잔차 연결이란 특정 블록의 입력과 출력을 더해 정보 손실을 방지하고, 그래디언트 흐름을 원활하게 합니다. 다음은 간단하게 구현한 코드입니다. (ResNet에서 처음 등장한 아이디어)**
```
residual = x
x = some_layer(x)
x = x + residual  # 잔차 연결

```
**정규화는 각 시점별로 벡터의 통계를 정규화 합니다. 정규화는 학습을 안정화 하며 폭주하여 사라지는 그래디언트를 막습니다.**

<span style="font-size:30px">**위 3가지의 개념을 하나로 합쳐 놓은 것이 인코더 레이어입니다. 그리고 이 인코더 레이어를 N개로 쌓게 된다면 하나의 인코더가 완성 됩니다.**</span>

## 디코더 레이어에 추가 된 구조

- **Masked MulitHead Attention**
- **Encoder - Decoder Attention (Cross Attention)**

### Masked MultiHead Attention이란?
![](https://velog.velcdn.com/images/hana_dorobo/post/faef1b38-3b7f-4dae-bdc6-92c85aa3fc00/image.jpg)
**위 이미지는 위의 인코더 레이어에 있는 멀티 헤드 어텐션을 설명할 때 사용한 이미지입니다. 하지만 Scaled Dot-Product Attention에 쳐진 빨간 박스를 보면 Mask(opt.)이 있습니다. 인코더 레이어에서는 입력 시퀀스의 패딩 토큰을 무시하기 위한 간단한 패딩 마스크(Padding Mask)만 사용이 되지만 디코더에는 다른 마스크 기법이 사용 됩니다.**

### 디코더에는 어떤 Mask가 사용되나?
**디코더에 다른 Mask 기법 필요한 이유는 Transformer가 나온 이유를 보면 알 수 있습니다. Transformer는 구글에서 기계 번역을 위해 나온 모델입니다.**
![](https://velog.velcdn.com/images/hana_dorobo/post/d119f2ac-b04d-4277-a7e4-39edfa6a287c/image.jpg)

(예시의 편의를 위해 영어와 한국어의 어순을 같게 함)


**인코더에 들어가는 "I like money" 라는 문장을 번역 하기 위해선 디코더에도 "나는 좋아 돈이"라는 문장도 디코더에 넣습니다. 그럼 디코더는 문장을 왼쪽부터 오른쪽으로 생성해야만 하는데 입력이 들어갈 때 한 번에 다 들어가는 구조라 미래 정보 즉 "돈이"에 대한 답을 이미 알고 있는 상태입니다.**

**이를 해결하기 위해 나온 기법으로 캐주얼 마스크(Causal Mask)가 있습니다.알고 있는 정답을 가려서 정답을 알지 못하게 만듭니다. 예를 들어 "나는 좋아 돈이" 에서 "돈이"를 마스크로 가려서 "나는 좋아"라는 문장이 된다면 디코더에서는 정답이 가려져 있기 때문에 인코더에서 유사한 값을 찾아서 단어를 생성 해야 합니다.**

### Encoder - Decoder Attention (Cross Attention)
**이제 디코더에서 마스크 된 문장, 단어를 생성 하기 위해서는 디코더에 있는 정보만으론 부족합니다. 그렇게 되면 인코더에서 만든 "I like money"의 정보를 참조해야 합니다.
이 때 필요하게 되는 것이 Encoder - Decoder Attention (Cross Attention)입니다.**

## Transformer 모델

![](https://velog.velcdn.com/images/hana_dorobo/post/0a255b6d-5bd4-4fd7-8783-4cd2bc3c9ee1/image.png)

<span style="font-size:28px">** 이제 위에서 설명한 PE를 적용후 MHA와 FFN으로 이루어진 인코더 레이어가 완성되고 추가로 Masked, Cross 어텐션을 적용하면 디코더 레이어가 됩니다. 이 인코더, 디코더 레이어를 N개 쌓은 후 Linear 레이어와 Softmax를 통과하면 하나의 Transformer 모델이 완성 됩니다. **</span>

# 3. 🛠️ PyTorch로 Transformer 직접 구현하기
- ## PositionalEncoding
```
class PositionalEncoding(nn.Module):
    def __init__(self, d_model, max_len=5000):
        super().__init__()

        # (max_len, d_model) 크기의 위치 행렬 생성
        pe = torch.zeros(max_len, d_model)
        position = torch.arange(0, max_len, dtype=torch.float).unsqueeze(1)  # (max_len, 1)
        div_term = torch.exp(torch.arange(0, d_model, 2).float() * (-math.log(10000.0) / d_model))

        pe[:, 0::2] = torch.sin(position * div_term)  # 짝수: sin
        pe[:, 1::2] = torch.cos(position * div_term)  # 홀수: cos

        pe = pe.unsqueeze(0)  # (1, max_len, d_model)
        self.register_buffer('pe', pe)  # 학습되지 않는 버퍼로 저장

    def forward(self, x):
        """
        x: (batch_size, seq_len, d_model)
        return: x + positional_encoding
        """
        seq_len = x.size(1)
        return x + self.pe[:, :seq_len, :]
```
**PositionalEncoding은 torch의 내장 `sin`, `cos` 함수를 사용하여 각 단어의 위치 정보를 인코딩합니다.  
짝수 차원에는 `sin`, 홀수 차원에는 `cos` 값을 적용해 서로 다른 주기의 함수로 위치를 표현함으로써  
위치마다 고유한 패턴을 가지게 됩니다. 이 방식은 학습 없이도 위치 정보를 효과적으로 표현할 수 있고,  
토큰 간 상대적 거리 정보를 보존할 수 있다는 장점이 있습니다.**

**또한, `register_buffer`를 사용하여 계산된 포지셔널 인코딩을 등록하는데,  
이는 모델 파라미터처럼 GPU로 이동되거나 `.state_dict()`에 저장되지만, optimizer로 학습되지 않는 고정된 값입니다.  
즉, 학습 대상이 아닌 상태 정보를 모델에 포함시킬 때 유용한 PyTorch의 기능입니다.**

- ## ScaledDotProductAttention
```
class ScaledDotProductAttention(nn.Module):
    def __init__(self):
        super().__init__()


    def forward(self, Q, K, V, mask=None):
        """
        Q: (batch_size, heads, seq_len_q, d_k)
        K: (batch_size, heads, seq_len_k, d_k)
        V: (batch_size, heads, seq_len_k, d_v)
        mask: (batch_size, heads, seq_len_q, seq_len_k) or None
            - 인코더 self-attention: src_mask (패딩 마스크)
            - 디코더 self-attention: tgt_mask (캐주얼 마스크)
            - 디코더 cross-attention: memory_mask (패딩 마스크)
        """
        # 1. Attention score 계산: Q @ K^T / sqrt(d_k)
        d_k = Q.size(-1)
        scores = torch.matmul(Q, K.transpose(-2,-1)) / math.sqrt(d_k)

        # 2. mask가 있다면 -inf처리
        # mask가 0인 위치(패딩 또는 미래 토큰)에 -inf를 할당하여 softmax 후 0이 되도록 함
        if mask is not None:
            scores = scores.masked_fill(mask==0, float('-inf'))
        
        # 3. Softmax 확률화
        atten_weight = F.softmax(scores, dim=-1)
        
        # 4. Attention 적용: V에 가중합
        output = torch.matmul(atten_weight, V)

        return output, atten_weight
```
**제가 구현한 ScaledDotProductAttention 코드입니다. 위에서 설명한 것 처럼 각 Q, K의 값을 입력 받아 가중합으로 구한 뒤 Softmax로 변환하여 다시 V와 가중합을 구하여 는 코드 입니다. 또한 Mask로 src_mask를 받는다면 인코더에 들어가는 마스크 기법(패딩) tgt_mask를 받게 된다면 디코더 마스크 기법(캐주얼)을 사용하여 masked_fill 함수를 사용하여 필요한 차원을 -inf로 가려 버립니다.**

- ## Multi-Head Attention

```
class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super(MultiHeadAttention, self).__init__()
        assert d_model % num_heads == 0, "d_model은 num_heads로 나누어져야 합니다"

        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        self.q_linear = nn.Linear(d_model, d_model)
        self.k_linear = nn.Linear(d_model, d_model)
        self.v_linear = nn.Linear(d_model, d_model)
        self.out_proj = nn.Linear(d_model, d_model)

        self.attention = ScaledDotProductAttention()

    def forward(self, x, mask=None, k_v=None):
        """
        x: query (B, seq_len_q, d_model)
        k_v: (B, seq_len_kv, d_model), None이면 x를 사용 (self-attention)
        mask: (B, 1, seq_len_q, seq_len_kv) or None
        """
        if k_v is None:
            K, V = x, x
        else:
            K, V = k_v, k_v

        B, L_q, _ = x.size()
        L_k = K.size(1)

        Q = self.q_linear(x)
        K = self.k_linear(K)
        V = self.v_linear(V)

        # shape 변경: (B, num_heads, seq_len, d_k)
        Q = Q.view(B, L_q, self.num_heads, self.d_k).transpose(1, 2)
        K = K.view(B, L_k, self.num_heads, self.d_k).transpose(1, 2)
        V = V.view(B, L_k, self.num_heads, self.d_k).transpose(1, 2)

        # attention 수행
        out, atten_weight = self.attention(Q, K, V, mask=mask)

        # 병합 후 최종 projection
        out = out.transpose(1, 2).contiguous().view(B, L_q, self.d_model)
        out = self.out_proj(out)

        return out, atten_weight
```
**Multi-Head Attention은 들어온 문장, 시계열을 3개의 FC레이어를 통해 Q, K, V의 선형 변환으로 생성을 합니다. 여러개의 head로 나누는 작업을 여러개의 Attention이 병렬 연산이 가능하게 합니다.**
```
self.out_proj = nn.Linear(d_model, d_model)

```
**이후 여러개의 head의 Attention 결과를 concat한 후 최종 출력으로 다시 projection 합니다.**

```
def forward(self, x, mask=None, k_v=None):

```
**forward 메서드에서 x라는 쿼리를 입력 받고 Key/Value를 위한 k_v라는 인자를 입력할 수 있습니다 또한 mask가 필요하다면 값을 할당하면 됩니다.**

```
if k_v is None:
    K, V = x, x
else:
    K, V = k_v, k_v

```
**k_v가 None이면 Self-Attention 진행 k_v가 주어지면 Cross-Attention을 진행합니다.**

```
mha = nn.MultiheadAttention(embed_dim=512, num_heads=8, batch_first=True)
query = key = value = torch.randn(32, 10, 512)
out, attn_weights = mha(query, key, value)
```
_(Torch의 Multi-Head Attention 사용법)_



- ## FeedForwardNetwork
```
class FeedForwardNetwork(nn.Module):
    def __init__(self, d_model, d_ff, dropout=0.1):
        super().__init__()

        self.linear1 = nn.Linear(d_model, d_ff)
        self.dropout = nn.Dropout(dropout)
        self.linear2 = nn.Linear(d_ff, d_model)

    def forward(self , x):
        # x : (batch_size, seq_len, d_model)
        return self.linear2(self.dropout(torch.relu(self.linear1(x))))
```
**FFN은 간단하게 구현되어 있으므로 설명을 생략하겠습니다.**

- ## EncoderLayer
```
class EncoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()

        self.mha = MultiHeadAttention(d_model, num_heads)
        self.ffn = FeedForwardNetwork(d_model, d_ff, dropout)

        self.norm1 = nn.LayerNorm(d_model)
        self.norm2 = nn.LayerNorm(d_model)
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask=None):
        # Multi-Head Attention + Add & Norm
        atten_output, _ = self.mha(x, mask=mask) # mask 인자 명시
        x = self.norm1(x + self.dropout(atten_output)) # 잔차 연결 + 정규화

        # FeedForwad + Add & Norm
        ffn_output = self.ffn(x)
        x = self.norm2(x + self.dropout(ffn_output))

        return x
```
**인코더 레이어는 위에서 구현한 MultiHeadAttention(Mask는 Padding Mask 사용)과 FeedForwardNetwork를 통해 값을 구합니다.**

```
ffn_output = self.ffn(x)
x = self.norm2(x + self.dropout(ffn_output))

```
**마지막으로 LayerNorm을 통해 각 잔차 연결 후에 정규화 적용 Dropout을 사용하여 과적합 방지를 합니다.**


- ## Encoder
```
class Encoder(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, num_layers, dropout=0.1): # max_len 제거
        super().__init__()

        # 포지셔널 인코딩은 Encoder를 사용하는 외부 모듈(Transformer)에서 처리
        # self.pos_encoder = PositionalEncoding(d_model, max_len) 

        # 인코더 레이어 쌓기
        self.layers = nn.ModuleList([
            EncoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])

        self.dropout = nn.Dropout(dropout)

    def forward(self, x, mask = None):
        # x : (batch_size, seq_len, d_model)
        # PositionalEncoding은 외부에서 적용된 후 입력으로 들어온다고 가정
        # x = self.pos_encoder(x) 
        # x = self.dropout(x) # Dropout은 PositionalEncoding 이후 또는 Embedding 이후에 한 번 적용하는 것이 일반적

        for layer in self.layers:
            x = layer(x, mask=mask)

        return x
```

**위에서 정의한 EncoderLayer를 num_layers 만큼 쌓습니다.**


```
encoder_layer = nn.TransformerEncoderLayer(
    d_model=512,
    nhead=8,
    dim_feedforward=2048,
    dropout=0.1,
    activation='relu',
    batch_first=True
)

encoder = nn.TransformerEncoder(encoder_layer, num_layers=6)
```

_(Torch로 인코더 레이어만 사용하고 싶을 때 사용법)_
- ## DecoderLayer
```
class DecoderLayer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, dropout=0.1):
        super().__init__()

        # 1. Masked Self-Attention
        self.self_atten = MultiHeadAttention(d_model, num_heads)
        self.norm1 = nn.LayerNorm(d_model)

        # 2. Encoder-Decoder Attention
        self.cross_atten = MultiHeadAttention(d_model, num_heads)
        self.norm2 = nn.LayerNorm(d_model)

        # 3. FeedForwardNetwork
        self.ffn = FeedForwardNetwork(d_model, d_ff, dropout)
        self.norm3 = nn.LayerNorm(d_model)

        self.dropout = nn.Dropout(dropout)

    def forward(self, x, enc_output, tgt_mask, memory_mask):
        # x: (batch_size, tgt_seq_len, d_model)
        # enc_output: (batch_size, src_seq_len, d_model)

        # Masked self-attention (decoder input)
        atten1, _ = self.self_atten(x, mask=tgt_mask) # mask 인자 명시
        x = self.norm1(x + self.dropout(atten1)) # Add & Norm 추가

        # Cross attention (query: decoder, key/value: encoder output)
        # 이전 x를 사용하는 것이 일반적. atten1을 query로 사용하지 않음.
        atten2, _ = self.cross_atten(x, mask=memory_mask, k_v=enc_output)
        x = self.norm2(x + self.dropout(atten2))

        # Feed Forwad
        ffn_out = self.ffn(x)
        x = self.norm3(x + self.dropout(ffn_out))

        return x
```

**디코더 레이어는 설명드린 것 처럼 Self-Attention, Cross-Attention을 사용합니다.**
```
# Masked self-attention (decoder input)
atten1, _ = self.self_atten(x, mask=tgt_mask) 
# Cross attention (query: decoder, key/value: encoder output)
atten2, _ = self.cross_atten(x, mask=memory_mask, k_v=enc_output)
```
**이렇게 mask의 인자를 memory_mask를 사용하여 캐주얼 마스크를 사용하고 k_v의 인자를 명시하여 디코더 레이어에 맞는 어텐션 구조를 가지게 됩니다.**


- ## Decoder
```
class Decoder(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, num_layers, dropout=0.1): # max_len 제거
        super().__init__()
        # PositionalEncoding은 Decoder를 사용하는 외부 모듈(Transformer)에서 처리
        # self.pos_encoder = PositionalEncoding(d_model, max_len)
        self.layers = nn.ModuleList([
            DecoderLayer(d_model, num_heads, d_ff, dropout)
            for _ in range(num_layers)
        ])
        self.dropout = nn.Dropout(dropout)

    def forward(self, x, enc_output, tgt_mask, memory_mask):
        # PositionalEncoding은 외부에서 적용된 후 입력으로 들어온다고 가정
        # x = self.pos_encoder(x)
        # x = self.dropout(x) # Dropout은 PositionalEncoding 이후 또는 Embedding 이후에 한 번 적용

        for layer in self.layers:
            x = layer(x, enc_output, tgt_mask, memory_mask)

        return x
```

**디코더도 인코더와 똑같이 디코더 레이어를 num_layers만큼 쌓으면 됩니다. 주석으로 positionalEncoding이 있을 경우의 코드를 작성 했습니다.**

```
decoder_layer = nn.TransformerDecoderLayer(
    d_model=512,
    nhead=8,
    dim_feedforward=2048,
    dropout=0.1,
    activation='relu',
    batch_first=True
)

decoder = nn.TransformerDecoder(decoder_layer, num_layers=6)
```
_(Torch의 디코더 레이어만 사용하고 싶을 때 사용법)_

## Transformer

```
class Transformer(nn.Module):
    def __init__(self, d_model, num_heads, d_ff, num_layers,
                 src_vocab_size, tgt_vocab_size, max_len=5000, dropout=0.1):
        super().__init__()

        self.src_embedding = nn.Embedding(src_vocab_size, d_model)
        self.tgt_embedding = nn.Embedding(tgt_vocab_size, d_model)
        
        self.pos_encoder = PositionalEncoding(d_model, max_len) # PositionalEncoding 인스턴스 추가
        self.dropout = nn.Dropout(dropout) # Dropout 추가

        self.encoder = Encoder(d_model, num_heads, d_ff, num_layers, dropout) # max_len 제거
        self.decoder = Decoder(d_model, num_heads, d_ff, num_layers, dropout) # max_len 제거

        self.output_linear = nn.Linear(d_model, tgt_vocab_size)

    def forward(self, src, tgt, src_mask = None, tgt_mask = None, memory_mask = None):
        """
        src: (B, src_seq_len)  → 인코더 입력
        tgt: (B, tgt_seq_len)  → 디코더 입력
        """

        # 1. 임베딩 및 포지셔널 인코딩
        src_embed = self.src_embedding(src) * math.sqrt(self.src_embedding.embedding_dim) # 스케일링 추가
        src_embed = self.pos_encoder(src_embed)
        src_embed = self.dropout(src_embed) # Dropout 적용

        tgt_embed = self.tgt_embedding(tgt) * math.sqrt(self.tgt_embedding.embedding_dim) # 스케일링 추가
        tgt_embed = self.pos_encoder(tgt_embed)
        tgt_embed = self.dropout(tgt_embed) # Dropout 적용


        # 2. 인코더
        enc_output = self.encoder(src_embed, mask=src_mask)

        # 3. 디코더
        # dec_output = self.decoder(tgt, mask=tgt_mask) # 수정 전
        dec_output = self.decoder(tgt_embed, enc_output, tgt_mask, memory_mask) # 수정 후

        # 4. Output Linear (언어 생성이라면 vocab_size)
        output = self.output_linear(dec_output)


        return output  # (B, tgt_seq_len, tgt_vocab_size)
```

**이후 모든 모듈을 하나로 합쳐서 Transformer로 만들면 됩니다. 임베딩은 torch에 있는 내장 함수를 사용하였습니다. 마지막 디코더 블록을 나온 후 Linear 레이어를 통해 단어를 생성합니다.**
```
transformer = nn.Transformer(
    d_model=512,
    nhead=8,
    num_encoder_layers=6,
    num_decoder_layers=6,
    dim_feedforward=2048,
    dropout=0.1,
    activation='relu',
    layer_norm_eps=1e-5,
    batch_first=True  # (B, L, D) 형태로 입력 받을 수 있게
)

```
_(Torch의 Transformer 모델 사용법)_

# 4. 📌 Transformer의 활용과 발전 흐름

- ## BERT (2018, Google)
<span style="font-size:25px">**BERT란 Transformer의 인코더 부분만 사용하여 주로 문장 분류, 질의 응답, 문장 유사도를 계산하는데 사용됩니다.**</span>

- ## GPT 시리즈 (2018~현재, OpenAI)
<span style="font-size:25px"> **Generative Pretrained Transformer로 사전 학습 된 트랜스포머라는 모델입니다. Transformer의 디코더 구조를 기반으로 다음 단어를 예측하는데 사용됩니다.**</span>
- ## T5, BART
<span style="font-size:25px"> **T5는 "Text-to-Text" 모델로 모든 NLP 작업을 텍스트 변환으로 정의합니다. BART는 BERT + GPT로 인코더와 디코더를 모두 사용하여 문장을 입력 받아 생성하는데 특화 된 모델입니다. **</span>

- ## 자연어 이외 분야의 활용
<span style="font-size:25px"> **이미지 시계열, 주식 데이터를 분석 하는데 활용 되고 있습니다. 또한 CNN 없이 이미지를 분류하는데도 쓰고 멀티 모달로 확장하여 텍스트 + 이미지에도 활용이 됩니다.**</span>

# 5. 마지막으로 


<span style="font-size:25px">**트랜스포머 모델의 구조는 대표적인 아키텍처 그림만 보면 단순해 보이지만, 실제로 이를 직접 구현해보면 상당히 다양한 개념과 메커니즘에 대한 깊은 이해가 필요하다는 것을 깨달았습니다.**</span>

<span style="font-size:25px">**처음에는 인코더와 디코더를 이해하고자 MultiHeadAttention을 살펴보다가, 자연스럽게 "왜 여러 개의 헤드를 사용하는가?"라는 질문으로 이어졌고, MultiHeadAttention 내부에 포함된 ScaledDotProductAttention의 구조와 원리를 직접 구현해보며 Q, K, V의 의미와 역할도 파악하게 되었습니다.**</span>

<span style="font-size:25px">**이러한 과정을 통해 인코더는 입력 시퀀스를 어떻게 처리하고 의미 있는 표현으로 변환하는지, 그리고 디코더는 이 정보를 기반으로 어떻게 다음 토큰(단어)을 예측하는지 점차적으로 이해할 수 있었습니다.**</span>

<span style="font-size:25px">**인코더와 디코더의 구조를 명확히 이해하고 나니, 트랜스포머가 단순히 자연어 처리에 국한된 모델이 아니라는 점도 알게 되었습니다. 예를 들어, 인코더는 텍스트 분류나 감정 분석 같은 입력 정보를 요약하거나 분류하는 작업에 적합하고, 디코더는 시퀀스 생성이 필요한 문장 생성, 요약, 번역, 또는 시계열 예측 등에 활용될 수 있습니다.**</span>

<span style="font-size:25px">**이러한 확장은 자연어뿐 아니라 이미지나 시계열 데이터에도 적용이 가능하다고 느꼈고, 특히 이미지 시계열 분류처럼 입력 시퀀스를 통해 상황을 판단하거나 예측해야 하는 문제에도 트랜스포머 구조가 유용하다는 가능성을 발견할 수 있었습니다.**</span>